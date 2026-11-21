const express = require('express');
const router  = express.Router();
const { db, nextId } = require('../db/database');

const defaultReviews = [
  { id:1, name:'Ramesh Kumar',     relation:'Patient',          rating:5, text:"Dr. Singh saved my father's life when he was on ventilator support. His expertise in critical care is exceptional. He explained everything clearly.", color:'#2e75b6', verified:1, created_at:new Date().toISOString() },
  { id:2, name:'Priya Sharma',     relation:"Patient's Family", rating:5, text:"My mother was in the ICU for 2 weeks. Dr. Shiva Singh was extremely professional and caring. The regular updates made a very difficult time manageable.", color:'#1e5f9e', verified:1, created_at:new Date().toISOString() },
  { id:3, name:'Anil Mishra',      relation:'Patient',          rating:5, text:"Excellent doctor with great knowledge of critical care. Very thorough in his approach. Highly recommended for any ICU-related cases.", color:'#5b9bd5', verified:1, created_at:new Date().toISOString() },
  { id:4, name:'Dr. Sunita Verma', relation:'Colleague',        rating:5, text:"I have had the privilege of working alongside Dr. Singh. His clinical judgment is outstanding, especially in managing complex ventilated patients.", color:'#128C7E', verified:1, created_at:new Date().toISOString() },
  { id:5, name:'Kavita Singh',     relation:"Patient's Family", rating:4, text:"Very knowledgeable and experienced doctor. The treatment was excellent. The quality of care more than makes up for any wait.", color:'#c8a84b', verified:1, created_at:new Date().toISOString() }
];

router.get('/', (req, res) => {
  try {
    let reviews = db.get('reviews').value();
    if (!Array.isArray(reviews) || reviews.length === 0) {
      db.set('reviews', defaultReviews).write();
      reviews = db.get('reviews').value();
    }
    const sorted = [...reviews].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    res.json(sorted);
  } catch(e) {
    console.error('[Reviews GET Error]', e);
    res.status(500).json({ error: e.message });
  }
});

router.post('/reset', (req, res) => {
  try {
    db.set('reviews', defaultReviews).write();
    res.json({ message: 'Reviews reset to defaults successfully', reviews: defaultReviews });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
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
