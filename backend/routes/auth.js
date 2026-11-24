const express     = require('express');
const router      = express.Router();
const dataService = require('../db/dataService');

const ADMIN_TOKEN = 'dr-shiva-token-auth-secure-2026';

router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    const validPassword = await dataService.getAdminPassword();

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

router.post('/change-password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const validPassword = await dataService.getAdminPassword();

    if (oldPassword !== validPassword) {
      return res.status(401).json({ error: 'Current password does not match' });
    }
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ error: 'New password must be at least 4 characters long' });
    }

    await dataService.updateAdminPassword(newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
