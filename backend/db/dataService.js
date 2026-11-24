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

// Helper to determine next numeric ID in Firestore
async function getNextFirestoreId(collectionName) {
  const fs = getFirestore();
  const snap = await fs.collection(collectionName).get();
  if (snap.empty) return 1;
  const ids = snap.docs.map(d => Number(d.data().id)).filter(n => !isNaN(n));
  return ids.length === 0 ? 1 : Math.max(...ids) + 1;
}

// ─────────────────────────────────────────────────────────────
// APPOINTMENTS
// ─────────────────────────────────────────────────────────────
async function getAppointments() {
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    const snap = await fs.collection('appointments').get();
    const list = snap.docs.map(doc => ({ ...doc.data(), _docId: doc.id }));
    return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }
  return db.get('appointments').sortBy('created_at').reverse().value() || [];
}

async function createAppointment(data) {
  if (isFirebaseConfigured()) {
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
    return record;
  }

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
}

async function updateAppointment(id, updates) {
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    // Query by id (number) or apt_id (string)
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
    return updatedSnap.data();
  }

  const numId = Number(id);
  const existing = db.get('appointments').find(a => a.id === numId || a.apt_id === id).value();
  if (!existing) return null;

  db.get('appointments')
    .find(a => a.id === numId || a.apt_id === id)
    .assign(updates)
    .write();

  return db.get('appointments').find(a => a.id === numId || a.apt_id === id).value();
}

async function deleteAppointment(id) {
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    let docRef = null;
    if (typeof id === 'string' && id.startsWith('APT-')) {
      docRef = fs.collection('appointments').doc(id);
    } else {
      const snap = await fs.collection('appointments').where('id', '==', Number(id)).limit(1).get();
      if (!snap.empty) docRef = snap.docs[0].ref;
    }
    if (docRef) await docRef.delete();
    return true;
  }
  const numId = Number(id);
  db.get('appointments').remove(a => a.id === numId || a.apt_id === id).write();
  return true;
}

// ─────────────────────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────────────────────
async function getReviews() {
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    const snap = await fs.collection('reviews').get();
    if (snap.empty) {
      // Seed default reviews in Firestore if collection is empty
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
  }

  let reviews = db.get('reviews').value();
  if (!Array.isArray(reviews) || reviews.length === 0) {
    db.set('reviews', DEFAULT_REVIEWS).write();
    reviews = DEFAULT_REVIEWS;
  }
  return [...reviews].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

async function createReview(data) {
  const colors = ['#2e75b6', '#1e5f9e', '#5b9bd5', '#128C7E', '#c8a84b', '#e87040'];
  const color = data.color || colors[Math.floor(Math.random() * colors.length)];

  if (isFirebaseConfigured()) {
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
    return record;
  }

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
}

async function updateReview(id, updates) {
  const numId = Number(id);
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    const docRef = fs.collection('reviews').doc(`rev_${numId}`);
    const snap = await docRef.get();
    if (!snap.exists) return null;
    await docRef.set(updates, { merge: true });
    const updated = await docRef.get();
    return updated.data();
  }

  const existing = db.get('reviews').find({ id: numId }).value();
  if (!existing) return null;
  db.get('reviews').find({ id: numId }).assign(updates).write();
  return db.get('reviews').find({ id: numId }).value();
}

async function deleteReview(id) {
  const numId = Number(id);
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    await fs.collection('reviews').doc(`rev_${numId}`).delete();
    return true;
  }
  db.get('reviews').remove({ id: numId }).write();
  return true;
}

async function resetReviews() {
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    const snap = await fs.collection('reviews').get();
    const batch = fs.batch();
    snap.docs.forEach(d => batch.delete(d.ref));
    DEFAULT_REVIEWS.forEach(rev => {
      const ref = fs.collection('reviews').doc(`rev_${rev.id}`);
      batch.set(ref, rev);
    });
    await batch.commit();
    return DEFAULT_REVIEWS;
  }

  db.set('reviews', DEFAULT_REVIEWS).write();
  return DEFAULT_REVIEWS;
}

// ─────────────────────────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────────────────────────
async function getMessages() {
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    const snap = await fs.collection('messages').get();
    const list = snap.docs.map(doc => doc.data());
    return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }
  return db.get('messages').sortBy('created_at').reverse().value() || [];
}

async function createMessage(data) {
  if (isFirebaseConfigured()) {
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
    return record;
  }

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
}

async function updateMessage(id, updates) {
  const numId = Number(id);
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    const docRef = fs.collection('messages').doc(`msg_${numId}`);
    const snap = await docRef.get();
    if (!snap.exists) return null;
    await docRef.set(updates, { merge: true });
    const updated = await docRef.get();
    return updated.data();
  }

  const existing = db.get('messages').find({ id: numId }).value();
  if (!existing) return null;
  db.get('messages').find({ id: numId }).assign(updates).write();
  return db.get('messages').find({ id: numId }).value();
}

async function deleteMessage(id) {
  const numId = Number(id);
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    await fs.collection('messages').doc(`msg_${numId}`).delete();
    return true;
  }
  db.get('messages').remove({ id: numId }).write();
  return true;
}

// ─────────────────────────────────────────────────────────────
// CHAT LOGS
// ─────────────────────────────────────────────────────────────
async function getChatLogs() {
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    const snap = await fs.collection('chat_logs').get();
    const list = snap.docs.map(doc => doc.data());
    return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }
  return db.get('chat_logs').sortBy('created_at').reverse().value() || [];
}

async function createChatLog(data) {
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    const id = await getNextFirestoreId('chat_logs');
    const record = {
      id,
      message: data.message || '',
      state: data.state || '',
      created_at: new Date().toISOString()
    };
    await fs.collection('chat_logs').doc(`chat_${id}`).set(record);
    return record;
  }

  const id = nextId('chat_logs');
  const record = {
    id,
    message: data.message || '',
    state: data.state || '',
    created_at: new Date().toISOString()
  };
  db.get('chat_logs').push(record).write();
  return record;
}

async function deleteChatLog(id) {
  const numId = Number(id);
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    await fs.collection('chat_logs').doc(`chat_${numId}`).delete();
    return true;
  }
  db.get('chat_logs').remove({ id: numId }).write();
  return true;
}

async function clearChatLogs() {
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    const snap = await fs.collection('chat_logs').get();
    const batch = fs.batch();
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    return true;
  }
  db.set('chat_logs', []).write();
  return true;
}

// ─────────────────────────────────────────────────────────────
// SITE CONTENT & CMS
// ─────────────────────────────────────────────────────────────
async function getContent() {
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    const docRef = fs.collection('settings').doc('content');
    const snap = await docRef.get();
    if (!snap.exists) {
      await docRef.set(defaultContent);
      return defaultContent;
    }
    return snap.data();
  }

  let content = db.get('content').value();
  if (!content) {
    db.set('content', defaultContent).write();
    content = defaultContent;
  }
  return content;
}

async function updateContent(newContent) {
  const current = await getContent();
  const updated = {
    profile:      newContent.profile      || current.profile,
    experience:   newContent.experience   || current.experience,
    education:    newContent.education    || current.education,
    skills:       newContent.skills       || current.skills,
    achievements: newContent.achievements || current.achievements
  };

  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    await fs.collection('settings').doc('content').set(updated);
    return updated;
  }

  db.set('content', updated).write();
  return updated;
}

async function resetContent() {
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    await fs.collection('settings').doc('content').set(defaultContent);
    return defaultContent;
  }

  db.set('content', defaultContent).write();
  return defaultContent;
}

// ─────────────────────────────────────────────────────────────
// ADMIN SETTINGS & AUTH
// ─────────────────────────────────────────────────────────────
async function getAdminPassword() {
  const defaultPass = process.env.ADMIN_PASSWORD || 'admin123';
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    const docRef = fs.collection('settings').doc('admin');
    const snap = await docRef.get();
    if (!snap.exists) {
      await docRef.set({ password: defaultPass });
      return defaultPass;
    }
    return snap.data().password || defaultPass;
  }

  const settings = db.get('admin_settings').value();
  return settings?.password || defaultPass;
}

async function updateAdminPassword(newPassword) {
  if (isFirebaseConfigured()) {
    const fs = getFirestore();
    await fs.collection('settings').doc('admin').set({ password: newPassword }, { merge: true });
    return true;
  }

  db.set('admin_settings', { password: newPassword }).write();
  return true;
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────────────────────
async function getStats() {
  const [appointments, reviews, messages, chatLogs] = await Promise.all([
    getAppointments(),
    getReviews(),
    getMessages(),
    getChatLogs()
  ]);

  const pendingApts   = appointments.filter(a => a.status === 'pending').length;
  const confirmedApts = appointments.filter(a => a.status === 'confirmed').length;
  const completedApts = appointments.filter(a => a.status === 'completed').length;
  const cancelledApts = appointments.filter(a => a.status === 'cancelled').length;

  const unreadMessages = messages.filter(m => !m.read).length;
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
    : '5.0';

  return {
    engine: isFirebaseConfigured() ? 'firebase-firestore' : 'local-lowdb',
    counts: {
      totalAppointments: appointments.length,
      pendingAppointments: pendingApts,
      confirmedAppointments: confirmedApts,
      completedAppointments: completedApts,
      cancelledAppointments: cancelledApts,
      totalReviews: reviews.length,
      avgRating,
      totalMessages: messages.length,
      unreadMessages,
      totalChatLogs: chatLogs.length
    },
    recent: {
      appointments: appointments.slice(0, 5),
      messages: messages.slice(0, 5),
      reviews: reviews.slice(0, 5)
    }
  };
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
