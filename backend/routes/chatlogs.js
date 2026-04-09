const express = require('express');
const router  = express.Router();
const { db, nextId } = require('../db/database');

router.post('/', (req, res) => {
  try {
    const { message='', state='' } = req.body;
    db.get('chat_logs').push({ id:nextId('chat_logs'), message, state, created_at:new Date().toISOString() }).write();
    res.status(201).json({ message:'Logged' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
