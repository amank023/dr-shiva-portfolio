const express     = require('express');
const router      = express.Router();
const dataService = require('../db/dataService');

router.get('/', async (req, res) => {
  try {
    const reviews = await dataService.getReviews();
    res.json(reviews);
  } catch(e) {
    console.error('[Reviews GET Error]', e);
    res.status(500).json({ error: e.message });
  }
});

router.post('/reset', async (req, res) => {
  try {
    const reviews = await dataService.resetReviews();
    res.json({ message: 'Reviews reset to defaults successfully', reviews });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, relation='Patient', rating, text } = req.body;
    if (!name || !rating || !text)
      return res.status(400).json({ error: 'Name, rating and text are required' });

    const record = await dataService.createReview({
      name,
      relation,
      rating: parseInt(rating),
      text
    });
    res.status(201).json(record);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const allowed = ['name', 'relation', 'rating', 'text', 'verified', 'color'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = key === 'rating' ? parseInt(req.body[key]) : req.body[key];
      }
    }

    const updated = await dataService.updateReview(id, updates);
    if (!updated) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review updated successfully', review: updated });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await dataService.deleteReview(id);
    res.json({ message: 'Review deleted successfully' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
