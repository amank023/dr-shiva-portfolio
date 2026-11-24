const express     = require('express');
const router      = express.Router();
const dataService = require('../db/dataService');

const ADMIN_TOKEN = 'dr-shiva-token-auth-secure-2026';

router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    const inputPassword = (password || '').trim();
    const validPassword = ((await dataService.getAdminPassword()) || '').trim();

    // Check against current DB password or accepted default variations
    const isMatch = (inputPassword === validPassword) ||
                    (inputPassword === 'admin123') ||
                    (inputPassword === 'Admin@123') ||
                    (process.env.ADMIN_PASSWORD && inputPassword === process.env.ADMIN_PASSWORD.trim());

    if (isMatch) {
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

router.post('/change-password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const inputOld = (oldPassword || '').trim();
    const inputNew = (newPassword || '').trim();
    const validPassword = ((await dataService.getAdminPassword()) || '').trim();

    const isOldMatch = (inputOld === validPassword) ||
                       (inputOld === 'admin123') ||
                       (inputOld === 'Admin@123') ||
                       (process.env.ADMIN_PASSWORD && inputOld === process.env.ADMIN_PASSWORD.trim());

    if (!isOldMatch) {
      return res.status(401).json({ error: 'Current password does not match' });
    }
    if (!inputNew || inputNew.length < 4) {
      return res.status(400).json({ error: 'New password must be at least 4 characters long' });
    }

    await dataService.updateAdminPassword(inputNew);
    res.json({ message: 'Password updated successfully' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
