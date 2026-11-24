require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Request logger with duration and status code
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      const status = res.statusCode;
      const icon = status < 400 ? '✅' : '❌';
      console.log(`[API] ${icon} ${req.method} ${req.url} -> ${status} (${ms}ms)`);
    });
  }
  next();
});

app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/reviews',      require('./routes/reviews'));
app.use('/api/messages',     require('./routes/messages'));
app.use('/api/chatlogs',     require('./routes/chatlogs'));
app.use('/api/content',      require('./routes/content'));
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/login',        require('./routes/auth'));
app.use('/api/stats',        require('./routes/stats'));

const { isFirebaseConfigured } = require('./db/firebase');

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  message: '🏥 API running',
  database: isFirebaseConfigured() ? 'Firebase Firestore (Cloud)' : 'Local LowDB (File)'
}));

app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));
app.use((err, req, res, next) => {
  console.error('[API Server Error]', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🗄️  Active Database Engine: ${isFirebaseConfigured() ? '🔥 Firebase Cloud Firestore' : '📁 Local LowDB (portfolio.json)'}`);
});
