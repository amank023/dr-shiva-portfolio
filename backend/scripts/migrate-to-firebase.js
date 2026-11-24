require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs   = require('fs');
const path = require('path');
const { getFirestore, isFirebaseConfigured, reinitFirebase } = require('../db/firebase');
const defaultContent = require('../db/defaultContent');

async function migrate() {
  console.log('\n🚀 ═══════════════════════════════════════════════════════════');
  console.log('🔥 [Migration] Dr. Shiva Portfolio -> Firebase Firestore');
  console.log('═══════════════════════════════════════════════════════════\n');

  if (!isFirebaseConfigured()) {
    reinitFirebase();
  }

  if (!isFirebaseConfigured()) {
    console.error('❌ [Error] Firebase is not configured.');
    console.error('👉 Please provide your Firebase Service Account credentials:');
    console.error('   Option A: Place "firebase-service-account.json" inside the backend/ folder.');
    console.error('   Option B: Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in backend/.env.');
    console.error('   Option C: Set FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/key.json in backend/.env.\n');
    process.exit(1);
  }

  const firestore = getFirestore();
  const dbFile = path.join(__dirname, '../db/portfolio.json');

  let localData = {
    appointments: [],
    reviews: [],
    messages: [],
    chat_logs: [],
    content: defaultContent,
    admin_settings: { password: process.env.ADMIN_PASSWORD || 'admin123' }
  };

  if (fs.existsSync(dbFile)) {
    try {
      const raw = fs.readFileSync(dbFile, 'utf8');
      localData = JSON.parse(raw);
      console.log(`📁 Read local database file: ${dbFile}`);
    } catch (err) {
      console.warn(`⚠️ Could not parse ${dbFile}, using fallback defaults:`, err.message);
    }
  } else {
    console.log('ℹ️ No existing portfolio.json found. Seeding with default clinic content.');
  }

  // 1. Migrate Appointments
  console.log('\n📅 [1/5] Migrating Appointments...');
  const appointments = localData.appointments || [];
  if (appointments.length > 0) {
    const batch = firestore.batch();
    for (const apt of appointments) {
      const docId = apt.apt_id || `APT-${String(apt.id || 1).padStart(6, '0')}`;
      const docRef = firestore.collection('appointments').doc(docId);
      batch.set(docRef, { ...apt, apt_id: docId });
    }
    await batch.commit();
    console.log(`   ✅ Migrated ${appointments.length} appointment(s)`);
  } else {
    console.log('   ℹ️ No appointments to migrate (0 records)');
  }

  // 2. Migrate Reviews
  console.log('\n⭐ [2/5] Migrating Reviews...');
  const reviews = localData.reviews && localData.reviews.length > 0 ? localData.reviews : [
    { id: 1, name: 'Ramesh Kumar',     relation: 'Patient',          rating: 5, text: "Dr. Singh saved my father's life when he was on ventilator support. His expertise in critical care is exceptional. He explained everything clearly.", color: '#2e75b6', verified: 1, created_at: new Date().toISOString() },
    { id: 2, name: 'Priya Sharma',     relation: "Patient's Family", rating: 5, text: "My mother was in the ICU for 2 weeks. Dr. Shiva Singh was extremely professional and caring. The regular updates made a very difficult time manageable.", color: '#1e5f9e', verified: 1, created_at: new Date().toISOString() },
    { id: 3, name: 'Anil Mishra',      relation: 'Patient',          rating: 5, text: "Excellent doctor with great knowledge of critical care. Very thorough in his approach. Highly recommended for any ICU-related cases.", color: '#5b9bd5', verified: 1, created_at: new Date().toISOString() },
    { id: 4, name: 'Dr. Sunita Verma', relation: 'Colleague',        rating: 5, text: "I have had the privilege of working alongside Dr. Singh. His clinical judgment is outstanding, especially in managing complex ventilated patients.", color: '#128C7E', verified: 1, created_at: new Date().toISOString() },
    { id: 5, name: 'Kavita Singh',     relation: "Patient's Family", rating: 4, text: "Very knowledgeable and experienced doctor. The treatment was excellent. The quality of care more than makes up for any wait.", color: '#c8a84b', verified: 1, created_at: new Date().toISOString() }
  ];

  const revBatch = firestore.batch();
  for (const rev of reviews) {
    const docRef = firestore.collection('reviews').doc(`rev_${rev.id}`);
    revBatch.set(docRef, rev);
  }
  await revBatch.commit();
  console.log(`   ✅ Migrated ${reviews.length} review(s)`);

  // 3. Migrate Messages
  console.log('\n✉️ [3/5] Migrating Contact Messages...');
  const messages = localData.messages || [];
  if (messages.length > 0) {
    const msgBatch = firestore.batch();
    for (const msg of messages) {
      const docRef = firestore.collection('messages').doc(`msg_${msg.id}`);
      msgBatch.set(docRef, msg);
    }
    await msgBatch.commit();
    console.log(`   ✅ Migrated ${messages.length} message(s)`);
  } else {
    console.log('   ℹ️ No messages to migrate (0 records)');
  }

  // 4. Migrate Chat Logs
  console.log('\n🤖 [4/5] Migrating Chat Logs...');
  const chatLogs = localData.chat_logs || [];
  if (chatLogs.length > 0) {
    const chatBatch = firestore.batch();
    for (const log of chatLogs) {
      const docRef = firestore.collection('chat_logs').doc(`chat_${log.id}`);
      chatBatch.set(docRef, log);
    }
    await chatBatch.commit();
    console.log(`   ✅ Migrated ${chatLogs.length} chat log(s)`);
  } else {
    console.log('   ℹ️ No chat logs to migrate (0 records)');
  }

  // 5. Migrate Site Content & Admin Settings
  console.log('\n⚙️ [5/5] Migrating Site Content & Admin Credentials...');
  const content = localData.content || defaultContent;
  await firestore.collection('settings').doc('content').set(content);
  console.log('   ✅ Saved website content to "settings/content"');

  const adminSettings = localData.admin_settings || { password: process.env.ADMIN_PASSWORD || 'admin123' };
  await firestore.collection('settings').doc('admin').set(adminSettings);
  console.log('   ✅ Saved admin settings to "settings/admin"');

  console.log('\n🎉 ═══════════════════════════════════════════════════════════');
  console.log('✅ ALL DATA SUCCESSFULLY MIGRATED TO FIREBASE CLOUD FIRESTORE!');
  console.log('═══════════════════════════════════════════════════════════\n');
  process.exit(0);
}

migrate().catch(err => {
  console.error('\n❌ Migration failed with error:', err);
  process.exit(1);
});
