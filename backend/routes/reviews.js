const express = require('express');
const router  = express.Router();
const { db, nextId } = require('../db/database');

router.get('/', (req, res) => {
  try { res.json(db.get('reviews').sortBy('created_at').reverse().value()); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/', (req, res) => {
  try {
    const { name, relation='Patient', rating, text } = req.body;
    if (!name || !rating || !text)
      return res.status(400).json({ error: 'Name, rating and text are required' });
    const colors = ['#2e75b6','#1e5f9e','#5b9bd5','#128C7E','#c8a84b','#e87040'];
    const color  = colors[Math.floor(Math.random()*colors.length)];
    const id     = nextId('reviews');
    const record = { id, name, relation, rating:parseInt(rating), text, color, verified:1, created_at:new Date().toISOString() };
    db.get('reviews').push(record).write();
    res.status(201).json(record);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
