const express     = require('express');
const router      = express.Router();
const dataService = require('../db/dataService');

router.get('/', async (req, res) => {
  try {
    const list = await dataService.getMessages();
    res.json(list);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ error: 'All fields are required' });

    const record = await dataService.createMessage({ name, email, subject, message });
    res.status(201).json({ id: record.id, message: 'Message sent successfully' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = {};
    if (req.body.read !== undefined) updates.read = req.body.read ? 1 : 0;

    const updated = await dataService.updateMessage(id, updates);
    if (!updated) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message updated', item: updated });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await dataService.deleteMessage(id);
    res.json({ message: 'Message deleted successfully' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
