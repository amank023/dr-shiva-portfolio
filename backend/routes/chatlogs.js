const express     = require('express');
const router      = express.Router();
const dataService = require('../db/dataService');

router.get('/', async (req, res) => {
  try {
    const logs = await dataService.getChatLogs();
    res.json(logs);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { message='', state='' } = req.body;
    const record = await dataService.createChatLog({ message, state });
    res.status(201).json({ message: 'Logged', id: record.id });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await dataService.deleteChatLog(id);
    res.json({ message: 'Log deleted' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    await dataService.clearChatLogs();
    res.json({ message: 'All chat logs cleared' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
