const express = require('express');
const router  = express.Router();
const { db, nextId } = require('../db/database');

function generateMeetCode() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const rand = (n) => Array.from({ length: n }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  return `${rand(3)}-${rand(4)}-${rand(3)}`;
}

router.get('/', (req, res) => {
  try { res.json(db.get('appointments').sortBy('created_at').reverse().value()); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/', (req, res) => {
  try {
    const { name, phone, age='', gender='', reason='', type='In-Person', date, alt_date='', time_slot, source='website', meet_link } = req.body;
    if (!name || !phone || !date || !time_slot)
      return res.status(400).json({ error: 'Name, phone, date and time_slot are required' });
    const id     = nextId('appointments');
    const apt_id = `APT-${String(id).padStart(6,'0')}`;

    let assignedMeetLink = (meet_link || '').trim();
    if (type === 'Video Call') {
      if (!assignedMeetLink) {
        const configuredMeet = (db.get('content.profile.googleMeetLink').value() || '').trim();
        assignedMeetLink = configuredMeet || `https://meet.google.com/${generateMeetCode()}`;
      }
    } else {
      assignedMeetLink = '';
    }

    const record = {
      id,
      apt_id,
      name,
      phone,
      age,
      gender,
      reason,
      type,
      date,
      alt_date,
      time_slot,
      status: 'pending',
      source,
      meet_link: assignedMeetLink,
      created_at: new Date().toISOString()
    };
    db.get('appointments').push(record).write();
    res.status(201).json({ id, apt_id, meet_link: assignedMeetLink, message: 'Appointment booked successfully' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.patch('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = db.get('appointments').find({ id }).value();
    if (!existing) return res.status(404).json({ error: 'Appointment not found' });
    
    const allowed = ['status', 'notes', 'date', 'alt_date', 'time_slot', 'name', 'phone', 'type', 'reason', 'age', 'gender', 'meet_link'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    // If switched to Video Call without link, auto-assign one
    if (updates.type === 'Video Call' && !updates.meet_link && !existing.meet_link) {
      const configuredMeet = (db.get('content.profile.googleMeetLink').value() || '').trim();
      updates.meet_link = configuredMeet || `https://meet.google.com/${generateMeetCode()}`;
    }
    updates.updated_at = new Date().toISOString();

    db.get('appointments').find({ id }).assign(updates).write();
    res.json({ message: 'Appointment updated successfully', appointment: db.get('appointments').find({ id }).value() });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = db.get('appointments').find({ id }).value();
    if (!existing) return res.status(404).json({ error: 'Appointment not found' });

    db.get('appointments').remove({ id }).write();
    res.json({ message: 'Appointment deleted successfully' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
