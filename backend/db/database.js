const low            = require('lowdb');
const FileSync       = require('lowdb/adapters/FileSync');
const path           = require('path');
const fs             = require('fs');
const defaultContent = require('./defaultContent');

let dbFilePath = path.join(__dirname, 'portfolio.json');
try {
  fs.accessSync(__dirname, fs.constants.W_OK);
} catch (e) {
  const tmpPath = path.join('/tmp', 'portfolio.json');
  if (!fs.existsSync(tmpPath) && fs.existsSync(dbFilePath)) {
    try { fs.copyFileSync(dbFilePath, tmpPath); } catch (_) {}
  }
  dbFilePath = tmpPath;
}

const adapter = new FileSync(dbFilePath);
const db      = low(adapter);

const originalWrite = db.write.bind(db);
db.write = function() {
  try {
    return originalWrite();
  } catch (err) {
    console.warn('⚠️ [LowDB] Write failed (read-only environment):', err.message);
    return db.getState();
  }
};

db.defaults({
  appointments: [],
  reviews: [],
  messages: [],
  chat_logs: [],
  content: defaultContent,
  admin_settings: { password: process.env.ADMIN_PASSWORD || 'admin123' }
}).write();

// Ensure content has all sections if portfolio.json existed previously without them
if (!db.get('content').value()) {
  db.set('content', defaultContent).write();
}
if (!db.get('admin_settings').value()) {
  db.set('admin_settings', { password: process.env.ADMIN_PASSWORD || 'admin123' }).write();
}

// Seed reviews if empty or invalid
const currentReviews = db.get('reviews').value();
if (!Array.isArray(currentReviews) || currentReviews.length === 0) {
  const initialReviews = [
    { id:1, name:'Ramesh Kumar',     relation:'Patient',          rating:5, text:"Dr. Singh saved my father's life when he was on ventilator support. His expertise in critical care is exceptional. He explained everything clearly.", color:'#2e75b6', verified:1, created_at:new Date().toISOString() },
    { id:2, name:'Priya Sharma',     relation:"Patient's Family", rating:5, text:"My mother was in the ICU for 2 weeks. Dr. Shiva Singh was extremely professional and caring. The regular updates made a very difficult time manageable.", color:'#1e5f9e', verified:1, created_at:new Date().toISOString() },
    { id:3, name:'Anil Mishra',      relation:'Patient',          rating:5, text:"Excellent doctor with great knowledge of critical care. Very thorough in his approach. Highly recommended for any ICU-related cases.", color:'#5b9bd5', verified:1, created_at:new Date().toISOString() },
    { id:4, name:'Dr. Sunita Verma', relation:'Colleague',        rating:5, text:"I have had the privilege of working alongside Dr. Singh. His clinical judgment is outstanding, especially in managing complex ventilated patients.", color:'#128C7E', verified:1, created_at:new Date().toISOString() },
    { id:5, name:'Kavita Singh',     relation:"Patient's Family", rating:4, text:"Very knowledgeable and experienced doctor. The treatment was excellent. The quality of care more than makes up for any wait.", color:'#c8a84b', verified:1, created_at:new Date().toISOString() }
  ];
  db.set('reviews', initialReviews).write();
  console.log('✅ Reviews seeded');
}

function nextId(col) {
  const items = db.get(col).value() || [];
  const validIds = items.map(i => Number(i.id)).filter(n => !isNaN(n));
  return validIds.length === 0 ? 1 : Math.max(...validIds) + 1;
}

console.log('✅ Database ready →', dbFilePath);
module.exports = { db, nextId };
