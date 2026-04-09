const express = require('express');
const router  = express.Router();
const { db, nextId } = require('../db/database');

router.get('/', (req, res) => {
  try { res.json(db.get('messages').sortBy('created_at').reverse().value()); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ error: 'All fields are required' });
    const id = nextId('messages');
    db.get('messages').push({ id, name, email, subject, message, read:0, created_at:new Date().toISOString() }).write();
    res.status(201).json({ id, message:'Message sent successfully' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
