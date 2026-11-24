const express     = require('express');
const router      = express.Router();
const dataService = require('../db/dataService');

router.get('/', async (req, res) => {
  try {
    const stats = await dataService.getStats();
    res.json(stats);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
