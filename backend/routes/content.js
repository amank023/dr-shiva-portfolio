const express     = require('express');
const router      = express.Router();
const dataService = require('../db/dataService');

router.get('/', async (req, res) => {
  try {
    const content = await dataService.getContent();
    res.json(content);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const newContent = req.body;
    if (!newContent || typeof newContent !== 'object') {
      return res.status(400).json({ error: 'Valid content object is required' });
    }
    const updated = await dataService.updateContent(newContent);
    res.json({ message: 'Content updated successfully', content: updated });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/reset', async (req, res) => {
  try {
    const content = await dataService.resetContent();
    res.json({ message: 'Content reset to defaults successfully', content });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
