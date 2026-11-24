require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { getFirestore, isFirebaseConfigured, reinitFirebase } = require('../db/firebase');

async function testConnection() {
  console.log('\n🔍 [Firebase] Testing Firestore connection...');

  if (!isFirebaseConfigured()) {
    reinitFirebase();
  }

  if (!isFirebaseConfigured()) {
    console.log('⚠️ [Status] Firebase is not yet configured.');
    console.log('ℹ️ The backend is currently operating safely in Local LowDB mode.');
    console.log('👉 To enable Firebase, place "firebase-service-account.json" in backend/ or set credentials in backend/.env');
    return;
  }

  const firestore = getFirestore();
  try {
    // 1. Perform write/delete ping test
    const pingRef = firestore.collection('_system_health').doc('ping');
    await pingRef.set({ timestamp: new Date().toISOString(), status: 'healthy' });
    await pingRef.delete();
    console.log('✅ Write & Delete permissions verified successfully!');

    // 2. Fetch collection counts
    const [aptSnap, revSnap, msgSnap, chatSnap, contentSnap] = await Promise.all([
      firestore.collection('appointments').get(),
      firestore.collection('reviews').get(),
      firestore.collection('messages').get(),
      firestore.collection('chat_logs').get(),
      firestore.collection('settings').doc('content').get()
    ]);

    console.log('\n📊 Firestore Collection Summary:');
    console.log(`   • Appointments: ${aptSnap.size}`);
    console.log(`   • Reviews:      ${revSnap.size}`);
    console.log(`   • Messages:     ${msgSnap.size}`);
    console.log(`   • Chat Logs:    ${chatSnap.size}`);
    console.log(`   • Site Content: ${contentSnap.exists ? 'Configured ✅' : 'Not yet initialized ⚠️'}`);
    console.log('\n🎉 Firebase Firestore connection is 100% operational!\n');
  } catch (err) {
    console.error('❌ Firestore connection test failed:', err.message);
  }
}

testConnection();
