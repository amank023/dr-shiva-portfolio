const express = require('express');
const router  = express.Router();
const { db, nextId } = require('../db/database');

router.get('/', (req, res) => {
  try {
    res.json(db.get('chat_logs').sortBy('created_at').reverse().value());
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/', (req, res) => {
  try {
    const { message='', state='' } = req.body;
    db.get('chat_logs').push({ id:nextId('chat_logs'), message, state, created_at:new Date().toISOString() }).write();
    res.status(201).json({ message:'Logged' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    db.get('chat_logs').remove({ id }).write();
    res.json({ message: 'Log deleted' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.delete('/', (req, res) => {
  try {
    db.set('chat_logs', []).write();
    res.json({ message: 'All chat logs cleared' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
