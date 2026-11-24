const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore }                   = require('firebase-admin/firestore');
const fs   = require('fs');
const path = require('path');

let firestore    = null;
let isConfigured = false;
let initError    = null;

function initFirebase() {
  if (firestore) return { firestore, isConfigured: true };

  try {
    // 1. Direct path from environment or default file locations
    const possiblePaths = [
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
      path.join(__dirname, '../firebase-service-account.json'),
      path.join(__dirname, '../firebase-key.json'),
      path.join(__dirname, '../../firebase-service-account.json')
    ].filter(Boolean);

    let keyFilePath = possiblePaths.find(p => fs.existsSync(p));

    // 2. Direct JSON string in environment variable
    const jsonStr = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    // 3. Individual environment variables
    const projectId   = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey  = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : null;

    let credential = null;

    if (jsonStr) {
      const parsed = JSON.parse(jsonStr);
      credential = cert(parsed);
      console.log('🔑 [Firebase] Loaded service account from JSON environment variable');
    } else if (keyFilePath) {
      const parsed = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
      credential = cert(parsed);
      console.log(`🔑 [Firebase] Loaded service account from ${path.basename(keyFilePath)}`);
    } else if (projectId && clientEmail && privateKey) {
      credential = cert({ projectId, clientEmail, privateKey });
      console.log(`🔑 [Firebase] Loaded credentials from environment variables for project ${projectId}`);
    }

    if (credential) {
      if (!getApps().length) {
        initializeApp({ credential });
      }
      firestore = getFirestore();
      firestore.settings({ ignoreUndefinedProperties: true });
      isConfigured = true;
      console.log('🔥 [Firebase] Successfully connected to Google Cloud Firestore!');
    } else {
      console.log('ℹ️ [Firebase] No credentials found. Operating in Local LowDB mode.');
      isConfigured = false;
      firestore = null;
    }
  } catch (err) {
    initError = err.message;
    console.warn('⚠️ [Firebase] Could not initialize Firebase Admin SDK:', err.message);
    isConfigured = false;
    firestore = null;
  }

  return { firestore, isConfigured, initError };
}

initFirebase();

module.exports = {
  getFirestore: () => firestore,
  isFirebaseConfigured: () => isConfigured,
  reinitFirebase: initFirebase
};
