require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/reviews',      require('./routes/reviews'));
app.use('/api/messages',     require('./routes/messages'));
app.use('/api/chatlogs',     require('./routes/chatlogs'));
app.use('/api/content',      require('./routes/content'));
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/stats',        require('./routes/stats'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: '🏥 API running' }));

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => res.status(500).json({ error: err.message }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
