const express = require('express');
const router  = express.Router();
const { db }  = require('../db/database');

const ADMIN_TOKEN = 'dr-shiva-token-auth-secure-2026';

router.post('/login', (req, res) => {
  try {
    const { password } = req.body;
    const settings = db.get('admin_settings').value() || { password: process.env.ADMIN_PASSWORD || 'admin123' };
    const validPassword = settings.password || 'admin123';

    if (password === validPassword) {
      res.json({ success: true, token: ADMIN_TOKEN, message: 'Authenticated successfully' });
    } else {
      res.status(401).json({ error: 'Invalid admin password' });
    }
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/verify', (req, res) => {
  try {
    const { token } = req.body;
    if (token === ADMIN_TOKEN) {
      res.json({ valid: true });
    } else {
      res.status(401).json({ valid: false, error: 'Session expired or invalid' });
    }
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/change-password', (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const settings = db.get('admin_settings').value() || { password: process.env.ADMIN_PASSWORD || 'admin123' };
    const validPassword = settings.password || 'admin123';

    if (oldPassword !== validPassword) {
      return res.status(401).json({ error: 'Current password does not match' });
    }
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ error: 'New password must be at least 4 characters long' });
    }

    db.set('admin_settings', { password: newPassword }).write();
    res.json({ message: 'Password updated successfully' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
