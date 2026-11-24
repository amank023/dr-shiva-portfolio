const { db, nextId } = require('./database');
const defaultContent  = require('./defaultContent');
const { getFirestore, isFirebaseConfigured } = require('./firebase');

// Default initial reviews for seeding
const DEFAULT_REVIEWS = [
  { id: 1, name: 'Ramesh Kumar',     relation: 'Patient',          rating: 5, text: "Dr. Singh saved my father's life when he was on ventilator support. His expertise in critical care is exceptional. He explained everything clearly.", color: '#2e75b6', verified: 1, created_at: new Date().toISOString() },
  { id: 2, name: 'Priya Sharma',     relation: "Patient's Family", rating: 5, text: "My mother was in the ICU for 2 weeks. Dr. Shiva Singh was extremely professional and caring. The regular updates made a very difficult time manageable.", color: '#1e5f9e', verified: 1, created_at: new Date().toISOString() },
  { id: 3, name: 'Anil Mishra',      relation: 'Patient',          rating: 5, text: "Excellent doctor with great knowledge of critical care. Very thorough in his approach. Highly recommended for any ICU-related cases.", color: '#5b9bd5', verified: 1, created_at: new Date().toISOString() },
  { id: 4, name: 'Dr. Sunita Verma', relation: 'Colleague',        rating: 5, text: "I have had the privilege of working alongside Dr. Singh. His clinical judgment is outstanding, especially in managing complex ventilated patients.", color: '#128C7E', verified: 1, created_at: new Date().toISOString() },
  { id: 5, name: 'Kavita Singh',     relation: "Patient's Family", rating: 4, text: "Very knowledgeable and experienced doctor. The treatment was excellent. The quality of care more than makes up for any wait.", color: '#c8a84b', verified: 1, created_at: new Date().toISOString() }
];

// Default initial messages for seeding
const DEFAULT_MESSAGES = [
  {
    id: 1,
    name: 'Rajesh Malhotra',
    email: 'rajesh.malhotra@gmail.com',
    subject: 'Second Opinion on ICU Ventilation Plan',
    message: 'Respected Dr. Shiva, my brother is currently admitted in hospital on ventilator support. We would like to request a second opinion consultation with you regarding his weaning plan.',
    read: 0,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 2,
    name: 'Meenakshi Sundaram',
    email: 'meenakshi.s@outlook.com',
    subject: 'Post-ICU Recovery & Follow-up',
    message: 'Hello Doctor, I was discharged from the ICU last month and wanted to schedule a follow-up consultation regarding breathing exercises and medication review.',
    read: 1,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

// Default initial appointments for seeding
const DEFAULT_APPOINTMENTS = [
  {
    id: 1,
    apt_id: 'APT-000001',
    name: 'Vikram Sethi',
    phone: '+91-9876543210',
    age: '48',
    gender: 'Male',
    type: 'In-Person',
    date: new Date().toISOString().split('T')[0],
    alt_date: '',
    time_slot: '11:00 AM',
    reason: 'Critical care follow-up consultation and pulmonary evaluation',
    status: 'pending',
    source: 'website',
    meet_link: '',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

// ─────────────────────────────────────────────────────────────
// HIGH-PERFORMANCE IN-MEMORY CACHE (<2ms read latency)
// ─────────────────────────────────────────────────────────────
const memoryCache = {
  appointments: { data: null, exp: 0 },
  reviews:      { data: null, exp: 0 },
  messages:     { data: null, exp: 0 },
  chatLogs:     { data: null, exp: 0 },
  content:      { data: null, exp: 0 },
  stats:        { data: null, exp: 0 }
};

function getFromCache(key) {
  const item = memoryCache[key];
  if (item && item.data && Date.now() < item.exp) {
    return item.data;
  }
  return null;
}

function setToCache(key, data, ttlMs = 12000) {
  memoryCache[key] = { data, exp: Date.now() + ttlMs };
}

function invalidateCache(key) {
  if (key && memoryCache[key]) {
    memoryCache[key].exp = 0;
  }
  memoryCache.stats.exp = 0; // any write invalidates stats
}

// Helper to determine next numeric ID in Firestore
async function getNextFirestoreId(collectionName) {
  const fs = getFirestore();
  const snap = await fs.collection(collectionName).get();
  if (snap.empty) return 1;
  const ids = snap.docs.map(d => Number(d.data().id)).filter(n => !isNaN(n));
  return ids.length === 0 ? 1 : Math.max(...ids) + 1;
}

// Resilient wrapper: tries Firestore first, gracefully falls back to Local LowDB on any error
async function runWithFallback(fsFn, localFn, opName) {
  if (isFirebaseConfigured()) {
    try {
      return await fsFn();
    } catch (err) {
      console.warn(`⚠️ [Firestore Fallback] ${opName} failed (${err.message}). Seamlessly serving from Local LowDB.`);
    }
  }
  return await localFn();
}

// ─────────────────────────────────────────────────────────────
// APPOINTMENTS
// ─────────────────────────────────────────────────────────────
async function getAppointments() {
  const cached = getFromCache('appointments');
  if (cached) return cached;

  const result = await runWithFallback(
    async () => {
      const fs = getFirestore();
      const snap = await fs.collection('appointments').get();
      if (snap.empty) {
        // Seed default appointment if empty
        const batch = fs.batch();
        for (const apt of DEFAULT_APPOINTMENTS) {
          batch.set(fs.collection('appointments').doc(apt.apt_id), apt);
        }
        await batch.commit();
        return [...DEFAULT_APPOINTMENTS];
      }
      const list = snap.docs.map(doc => ({ ...doc.data(), _docId: doc.id }));
      return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    },
    async () => {
      let list = db.get('appointments').value();
      if (!Array.isArray(list) || list.length === 0) {
        db.set('appointments', DEFAULT_APPOINTMENTS).write();
        list = DEFAULT_APPOINTMENTS;
      }
      return [...list].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    },
    'getAppointments'
  );

  setToCache('appointments', result, 10000);
  return result;
}

async function createAppointment(data) {
  invalidateCache('appointments');
  return runWithFallback(
    async () => {
      const fs = getFirestore();
      const id = await getNextFirestoreId('appointments');
      const apt_id = `APT-${String(id).padStart(6, '0')}`;
      const record = {
        id,
        apt_id,
        name: data.name,
        phone: data.phone,
        age: data.age || '',
        gender: data.gender || '',
        reason: data.reason || '',
        type: data.type || 'In-Person',
        date: data.date,
        alt_date: data.alt_date || '',
        time_slot: data.time_slot,
        status: 'pending',
        source: data.source || 'website',
        meet_link: data.meet_link || '',
        created_at: new Date().toISOString()
      };
      await fs.collection('appointments').doc(apt_id).set(record);
      try { db.get('appointments').push(record).write(); } catch (_) {}
      return record;
    },
    async () => {
      const id = nextId('appointments');
      const apt_id = `APT-${String(id).padStart(6, '0')}`;
      const record = {
        id,
        apt_id,
        name: data.name,
        phone: data.phone,
        age: data.age || '',
        gender: data.gender || '',
        reason: data.reason || '',
        type: data.type || 'In-Person',
        date: data.date,
        alt_date: data.alt_date || '',
        time_slot: data.time_slot,
        status: 'pending',
        source: data.source || 'website',
        meet_link: data.meet_link || '',
        created_at: new Date().toISOString()
      };
      db.get('appointments').push(record).write();
      return record;
    },
    'createAppointment'
  );
}

async function updateAppointment(id, updates) {
  invalidateCache('appointments');
  return runWithFallback(
    async () => {
      const fs = getFirestore();
      let docRef = null;
      if (typeof id === 'string' && id.startsWith('APT-')) {
        docRef = fs.collection('appointments').doc(id);
      } else {
        const snap = await fs.collection('appointments').where('id', '==', Number(id)).limit(1).get();
        if (!snap.empty) docRef = snap.docs[0].ref;
      }
      if (!docRef) return null;
      const existingSnap = await docRef.get();
      if (!existingSnap.exists) return null;
      await docRef.set(updates, { merge: true });
      const updatedSnap = await docRef.get();
      try {
        const numId = Number(id);
        db.get('appointments').find(a => a.id === numId || a.apt_id === id).assign(updates).write();
      } catch (_) {}
      return updatedSnap.data();
    },
    async () => {
      const numId = Number(id);
      const existing = db.get('appointments').find(a => a.id === numId || a.apt_id === id).value();
      if (!existing) return null;
      db.get('appointments').find(a => a.id === numId || a.apt_id === id).assign(updates).write();
      return db.get('appointments').find(a => a.id === numId || a.apt_id === id).value();
    },
    'updateAppointment'
  );
}

async function deleteAppointment(id) {
  invalidateCache('appointments');
  return runWithFallback(
    async () => {
      const fs = getFirestore();
      let docRef = null;
      if (typeof id === 'string' && id.startsWith('APT-')) {
        docRef = fs.collection('appointments').doc(id);
      } else {
        const snap = await fs.collection('appointments').where('id', '==', Number(id)).limit(1).get();
        if (!snap.empty) docRef = snap.docs[0].ref;
      }
      if (docRef) await docRef.delete();
      try {
        const numId = Number(id);
        db.get('appointments').remove(a => a.id === numId || a.apt_id === id).write();
      } catch (_) {}
      return true;
    },
    async () => {
      const numId = Number(id);
      db.get('appointments').remove(a => a.id === numId || a.apt_id === id).write();
      return true;
    },
    'deleteAppointment'
  );
}

// ─────────────────────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────────────────────
async function getReviews() {
  const cached = getFromCache('reviews');
  if (cached) return cached;

  const result = await runWithFallback(
    async () => {
      const fs = getFirestore();
      const snap = await fs.collection('reviews').get();
      if (snap.empty) {
        const batch = fs.batch();
        for (const rev of DEFAULT_REVIEWS) {
          const ref = fs.collection('reviews').doc(`rev_${rev.id}`);
          batch.set(ref, rev);
        }
        await batch.commit();
        return [...DEFAULT_REVIEWS].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      }
      const list = snap.docs.map(doc => doc.data());
      return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    },
    async () => {
      let reviews = db.get('reviews').value();
      if (!Array.isArray(reviews) || reviews.length === 0) {
        db.set('reviews', DEFAULT_REVIEWS).write();
        reviews = DEFAULT_REVIEWS;
      }
      return [...reviews].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    },
    'getReviews'
  );

  setToCache('reviews', result, 15000);
  return result;
}

async function createReview(data) {
  invalidateCache('reviews');
  const colors = ['#2e75b6', '#1e5f9e', '#5b9bd5', '#128C7E', '#c8a84b', '#e87040'];
  const color = data.color || colors[Math.floor(Math.random() * colors.length)];

  return runWithFallback(
    async () => {
      const fs = getFirestore();
      const id = await getNextFirestoreId('reviews');
      const record = {
        id,
        name: data.name,
        relation: data.relation || 'Patient',
        rating: parseInt(data.rating),
        text: data.text,
        color,
        verified: 1,
        created_at: new Date().toISOString()
      };
      await fs.collection('reviews').doc(`rev_${id}`).set(record);
      try { db.get('reviews').push(record).write(); } catch (_) {}
      return record;
    },
    async () => {
      const id = nextId('reviews');
      const record = {
        id,
        name: data.name,
        relation: data.relation || 'Patient',
        rating: parseInt(data.rating),
        text: data.text,
        color,
        verified: 1,
        created_at: new Date().toISOString()
      };
      db.get('reviews').push(record).write();
      return record;
    },
    'createReview'
  );
}

async function updateReview(id, updates) {
  invalidateCache('reviews');
  const numId = Number(id);
  return runWithFallback(
    async () => {
      const fs = getFirestore();
      const docRef = fs.collection('reviews').doc(`rev_${numId}`);
      const snap = await docRef.get();
      if (!snap.exists) return null;
      await docRef.set(updates, { merge: true });
      const updated = await docRef.get();
      try { db.get('reviews').find({ id: numId }).assign(updates).write(); } catch (_) {}
      return updated.data();
    },
    async () => {
      const existing = db.get('reviews').find({ id: numId }).value();
      if (!existing) return null;
      db.get('reviews').find({ id: numId }).assign(updates).write();
      return db.get('reviews').find({ id: numId }).value();
    },
    'updateReview'
  );
}

async function deleteReview(id) {
  invalidateCache('reviews');
  const numId = Number(id);
  return runWithFallback(
    async () => {
      const fs = getFirestore();
      await fs.collection('reviews').doc(`rev_${numId}`).delete();
      try { db.get('reviews').remove({ id: numId }).write(); } catch (_) {}
      return true;
    },
    async () => {
      db.get('reviews').remove({ id: numId }).write();
      return true;
    },
    'deleteReview'
  );
}

async function resetReviews() {
  invalidateCache('reviews');
  return runWithFallback(
    async () => {
      const fs = getFirestore();
      const snap = await fs.collection('reviews').get();
      const batch = fs.batch();
      snap.docs.forEach(d => batch.delete(d.ref));
      DEFAULT_REVIEWS.forEach(rev => {
        const ref = fs.collection('reviews').doc(`rev_${rev.id}`);
        batch.set(ref, rev);
      });
      await batch.commit();
      try { db.set('reviews', DEFAULT_REVIEWS).write(); } catch (_) {}
      return DEFAULT_REVIEWS;
    },
    async () => {
      db.set('reviews', DEFAULT_REVIEWS).write();
      return DEFAULT_REVIEWS;
    },
    'resetReviews'
  );
}

// ─────────────────────────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────────────────────────
async function getMessages() {
  const cached = getFromCache('messages');
  if (cached) return cached;

  const result = await runWithFallback(
    async () => {
      const fs = getFirestore();
      const snap = await fs.collection('messages').get();
      if (snap.empty) {
        // Seed default messages if collection is empty
        const batch = fs.batch();
        for (const msg of DEFAULT_MESSAGES) {
          batch.set(fs.collection('messages').doc(`msg_${msg.id}`, msg), msg);
        }
        await batch.commit();
        return [...DEFAULT_MESSAGES];
      }
      const list = snap.docs.map(doc => doc.data());
      return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    },
    async () => {
      let list = db.get('messages').value();
      if (!Array.isArray(list) || list.length === 0) {
        db.set('messages', DEFAULT_MESSAGES).write();
        list = DEFAULT_MESSAGES;
      }
      return [...list].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    },
    'getMessages'
  );

  setToCache('messages', result, 10000);
  return result;
}

async function createMessage(data) {
  invalidateCache('messages');
  return runWithFallback(
    async () => {
      const fs = getFirestore();
      const id = await getNextFirestoreId('messages');
      const record = {
        id,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        read: 0,
        created_at: new Date().toISOString()
      };
      await fs.collection('messages').doc(`msg_${id}`).set(record);
      try { db.get('messages').push(record).write(); } catch (_) {}
      return record;
    },
    async () => {
      const id = nextId('messages');
      const record = {
        id,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        read: 0,
        created_at: new Date().toISOString()
      };
      db.get('messages').push(record).write();
      return record;
    },
    'createMessage'
  );
}

async function updateMessage(id, updates) {
  invalidateCache('messages');
  const numId = Number(id);
  return runWithFallback(
    async () => {
      const fs = getFirestore();
      const docRef = fs.collection('messages').doc(`msg_${numId}`);
      const snap = await docRef.get();
      if (!snap.exists) return null;
      await docRef.set(updates, { merge: true });
      const updated = await docRef.get();
      try { db.get('messages').find({ id: numId }).assign(updates).write(); } catch (_) {}
      return updated.data();
    },
    async () => {
      const existing = db.get('messages').find({ id: numId }).value();
      if (!existing) return null;
      db.get('messages').find({ id: numId }).assign(updates).write();
      return db.get('messages').find({ id: numId }).value();
    },
    'updateMessage'
  );
}

async function deleteMessage(id) {
  invalidateCache('messages');
  const numId = Number(id);
  return runWithFallback(
    async () => {
      const fs = getFirestore();
      await fs.collection('messages').doc(`msg_${numId}`).delete();
      try { db.get('messages').remove({ id: numId }).write(); } catch (_) {}
      return true;
    },
    async () => {
      db.get('messages').remove({ id: numId }).write();
      return true;
    },
    'deleteMessage'
  );
}

// ─────────────────────────────────────────────────────────────
// CHAT LOGS
// ─────────────────────────────────────────────────────────────
async function getChatLogs() {
  const cached = getFromCache('chatLogs');
  if (cached) return cached;

  const result = await runWithFallback(
    async () => {
      const fs = getFirestore();
      const snap = await fs.collection('chat_logs').get();
      const list = snap.docs.map(doc => doc.data());
      return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    },
    async () => {
      return db.get('chat_logs').sortBy('created_at').reverse().value() || [];
    },
    'getChatLogs'
  );

  setToCache('chatLogs', result, 10000);
  return result;
}

async function createChatLog(data) {
  invalidateCache('chatLogs');
  return runWithFallback(
    async () => {
      const fs = getFirestore();
      const id = await getNextFirestoreId('chat_logs');
      const record = {
        id,
        message: data.message || '',
        state: data.state || '',
        created_at: new Date().toISOString()
      };
      await fs.collection('chat_logs').doc(`chat_${id}`).set(record);
      try { db.get('chat_logs').push(record).write(); } catch (_) {}
      return record;
    },
    async () => {
      const id = nextId('chat_logs');
      const record = {
        id,
        message: data.message || '',
        state: data.state || '',
        created_at: new Date().toISOString()
      };
      db.get('chat_logs').push(record).write();
      return record;
    },
    'createChatLog'
  );
}

async function deleteChatLog(id) {
  invalidateCache('chatLogs');
  const numId = Number(id);
  return runWithFallback(
    async () => {
      const fs = getFirestore();
      await fs.collection('chat_logs').doc(`chat_${numId}`).delete();
      try { db.get('chat_logs').remove({ id: numId }).write(); } catch (_) {}
      return true;
    },
    async () => {
      db.get('chat_logs').remove({ id: numId }).write();
      return true;
    },
    'deleteChatLog'
  );
}

async function clearChatLogs() {
  invalidateCache('chatLogs');
  return runWithFallback(
    async () => {
      const fs = getFirestore();
      const snap = await fs.collection('chat_logs').get();
      const batch = fs.batch();
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      try { db.set('chat_logs', []).write(); } catch (_) {}
      return true;
    },
    async () => {
      db.set('chat_logs', []).write();
      return true;
    },
    'clearChatLogs'
  );
}

// ─────────────────────────────────────────────────────────────
// SITE CONTENT & CMS
// ─────────────────────────────────────────────────────────────
async function getContent() {
  const cached = getFromCache('content');
  if (cached) return cached;

  const result = await runWithFallback(
    async () => {
      const fs = getFirestore();
      const docRef = fs.collection('settings').doc('content');
      const snap = await docRef.get();
      if (!snap.exists) {
        await docRef.set(defaultContent);
        return defaultContent;
      }
      return snap.data();
    },
    async () => {
      let content = db.get('content').value();
      if (!content) {
        db.set('content', defaultContent).write();
        content = defaultContent;
      }
      return content;
    },
    'getContent'
  );

  setToCache('content', result, 30000);
  return result;
}

async function updateContent(newContent) {
  invalidateCache('content');
  const current = await getContent();
  const updated = {
    profile:      newContent.profile      || current.profile,
    experience:   newContent.experience   || current.experience,
    education:    newContent.education    || current.education,
    skills:       newContent.skills       || current.skills,
    achievements: newContent.achievements || current.achievements
  };

  return runWithFallback(
    async () => {
      const fs = getFirestore();
      await fs.collection('settings').doc('content').set(updated);
      try { db.set('content', updated).write(); } catch (_) {}
      return updated;
    },
    async () => {
      db.set('content', updated).write();
      return updated;
    },
    'updateContent'
  );
}

async function resetContent() {
  invalidateCache('content');
  return runWithFallback(
    async () => {
      const fs = getFirestore();
      await fs.collection('settings').doc('content').set(defaultContent);
      try { db.set('content', defaultContent).write(); } catch (_) {}
      return defaultContent;
    },
    async () => {
      db.set('content', defaultContent).write();
      return defaultContent;
    },
    'resetContent'
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN SETTINGS & AUTH
// ─────────────────────────────────────────────────────────────
async function getAdminPassword() {
  const defaultPass = process.env.ADMIN_PASSWORD || 'admin123';
  return runWithFallback(
    async () => {
      const fs = getFirestore();
      const docRef = fs.collection('settings').doc('admin');
      const snap = await docRef.get();
      if (!snap.exists) {
        await docRef.set({ password: defaultPass });
        return defaultPass;
      }
      return snap.data().password || defaultPass;
    },
    async () => {
      const settings = db.get('admin_settings').value();
      return settings?.password || defaultPass;
    },
    'getAdminPassword'
  );
}

async function updateAdminPassword(newPassword) {
  return runWithFallback(
    async () => {
      const fs = getFirestore();
      await fs.collection('settings').doc('admin').set({ password: newPassword }, { merge: true });
      try { db.set('admin_settings', { password: newPassword }).write(); } catch (_) {}
      return true;
    },
    async () => {
      db.set('admin_settings', { password: newPassword }).write();
      return true;
    },
    'updateAdminPassword'
  );
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────────────────────
async function getStats() {
  const cached = getFromCache('stats');
  if (cached) return cached;

  let appointments = [];
  let reviews = [];
  let messages = [];
  let chatLogs = [];

  try {
    [appointments, reviews, messages, chatLogs] = await Promise.all([
      getAppointments(),
      getReviews(),
      getMessages(),
      getChatLogs()
    ]);
  } catch (err) {
    console.warn('⚠️ [Stats] Fallback to local store for stats calculation:', err.message);
    appointments = db.get('appointments').value() || [];
    reviews      = db.get('reviews').value() || [];
    messages     = db.get('messages').value() || [];
    chatLogs     = db.get('chat_logs').value() || [];
  }

  const safeApts = Array.isArray(appointments) ? appointments : [];
  const safeRevs = Array.isArray(reviews) ? reviews : [];
  const safeMsgs = Array.isArray(messages) ? messages : [];
  const safeLogs = Array.isArray(chatLogs) ? chatLogs : [];

  const pendingApts   = safeApts.filter(a => a.status === 'pending').length;
  const confirmedApts = safeApts.filter(a => a.status === 'confirmed').length;
  const completedApts = safeApts.filter(a => a.status === 'completed').length;
  const cancelledApts = safeApts.filter(a => a.status === 'cancelled').length;

  const unreadMessages = safeMsgs.filter(m => !m.read).length;
  const avgRating = safeRevs.length
    ? (safeRevs.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / safeRevs.length).toFixed(1)
    : '5.0';

  const statsResult = {
    engine: isFirebaseConfigured() ? 'firebase-firestore' : 'local-lowdb',
    counts: {
      totalAppointments: safeApts.length,
      pendingAppointments: pendingApts,
      confirmedAppointments: confirmedApts,
      completedAppointments: completedApts,
      cancelledAppointments: cancelledApts,
      totalReviews: safeRevs.length,
      avgRating,
      totalMessages: safeMsgs.length,
      unreadMessages,
      totalChatLogs: safeLogs.length
    },
    recent: {
      appointments: safeApts.slice(0, 5),
      messages: safeMsgs.slice(0, 5),
      reviews: safeRevs.slice(0, 5)
    }
  };

  setToCache('stats', statsResult, 10000);
  return statsResult;
}

module.exports = {
  isFirebaseConfigured,
  // Appointments
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  // Reviews
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  resetReviews,
  // Messages
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
  // Chat Logs
  getChatLogs,
  createChatLog,
  deleteChatLog,
  clearChatLogs,
  // Content
  getContent,
  updateContent,
  resetContent,
  // Auth
  getAdminPassword,
  updateAdminPassword,
  // Stats
  getStats
};
