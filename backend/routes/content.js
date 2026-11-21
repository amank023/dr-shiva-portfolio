const express        = require('express');
const router         = express.Router();
const { db }         = require('../db/database');
const defaultContent = require('../db/defaultContent');

router.get('/', (req, res) => {
  try {
    let content = db.get('content').value();
    if (!content) {
      db.set('content', defaultContent).write();
      content = defaultContent;
    }
    res.json(content);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/', (req, res) => {
  try {
    const newContent = req.body;
    if (!newContent || typeof newContent !== 'object') {
      return res.status(400).json({ error: 'Valid content object is required' });
    }

    const current = db.get('content').value() || defaultContent;
    const updated = {
      profile:      newContent.profile      || current.profile,
      experience:   newContent.experience   || current.experience,
      education:    newContent.education    || current.education,
      skills:       newContent.skills       || current.skills,
      achievements: newContent.achievements || current.achievements
    };

    db.set('content', updated).write();
    res.json({ message: 'Content updated successfully', content: updated });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/reset', (req, res) => {
  try {
    db.set('content', defaultContent).write();
    res.json({ message: 'Content reset to defaults successfully', content: defaultContent });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
