require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Request logger with duration, status code, and full original URL
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    const icon = status < 400 ? '✅' : '❌';
    console.log(`[API] ${icon} ${req.method} ${req.originalUrl || req.url} -> ${status} (${ms}ms)`);
  });
  next();
});

// Route handlers
const appointmentsRoute = require('./routes/appointments');
const reviewsRoute      = require('./routes/reviews');
const messagesRoute     = require('./routes/messages');
const chatlogsRoute     = require('./routes/chatlogs');
const contentRoute      = require('./routes/content');
const authRoute         = require('./routes/auth');
const statsRoute        = require('./routes/stats');

// Mount both prefixed (/api/...) and direct (/...) paths + aliases so no client request ever 404s
app.use(['/api/appointments', '/appointments', '/api/appointment', '/appointment'], appointmentsRoute);
app.use(['/api/reviews', '/reviews', '/api/review', '/review'], reviewsRoute);
app.use(['/api/messages', '/messages', '/api/message', '/message'], messagesRoute);
app.use([
  '/api/chatlogs', '/chatlogs',
  '/api/chat-logs', '/chat-logs',
  '/api/chat_logs', '/chat_logs',
  '/api/botlogs', '/botlogs',
  '/api/bot-logs', '/bot-logs',
  '/api/logs', '/logs'
], chatlogsRoute);
app.use(['/api/content', '/content'], contentRoute);
app.use(['/api/auth', '/auth', '/api/login', '/login'], authRoute);
app.use(['/api/stats', '/stats', '/api/admin/stats', '/admin/stats'], statsRoute);

const { isFirebaseConfigured } = require('./db/firebase');

app.get(['/api/health', '/health'], (req, res) => res.json({
  status: 'ok',
  message: '🏥 API running',
  database: isFirebaseConfigured() ? 'Firebase Firestore (Cloud)' : 'Local LowDB (File)'
}));

// Fallback 404 with helpful diagnostic message
app.use((req, res) => {
  console.warn(`[API 404] Route not found: ${req.method} ${req.originalUrl || req.url}`);
  res.status(404).json({ error: `Endpoint ${req.originalUrl || req.url} not found` });
});

app.use((err, req, res, next) => {
  console.error('[API Server Error]', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🗄️  Active Database Engine: ${isFirebaseConfigured() ? '🔥 Firebase Cloud Firestore' : '📁 Local LowDB (portfolio.json)'}`);
  });
}

module.exports = app;
