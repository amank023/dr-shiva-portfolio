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

router.patch('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = db.get('reviews').find({ id }).value();
    if (!existing) return res.status(404).json({ error: 'Review not found' });

    const allowed = ['name', 'relation', 'rating', 'text', 'verified', 'color'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = key === 'rating' ? parseInt(req.body[key]) : req.body[key];
      }
    }

    db.get('reviews').find({ id }).assign(updates).write();
    res.json({ message: 'Review updated successfully', review: db.get('reviews').find({ id }).value() });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = db.get('reviews').find({ id }).value();
    if (!existing) return res.status(404).json({ error: 'Review not found' });

    db.get('reviews').remove({ id }).write();
    res.json({ message: 'Review deleted successfully' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
