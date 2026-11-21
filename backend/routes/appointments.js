const express = require('express');
const router  = express.Router();
const { db, nextId } = require('../db/database');

router.get('/', (req, res) => {
  try { res.json(db.get('appointments').sortBy('created_at').reverse().value()); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/', (req, res) => {
  try {
    const { name, phone, age='', gender='', reason='', type='In-Person', date, alt_date='', time_slot, source='website' } = req.body;
    if (!name || !phone || !date || !time_slot)
      return res.status(400).json({ error: 'Name, phone, date and time_slot are required' });
    const id     = nextId('appointments');
    const apt_id = `APT-${String(id).padStart(6,'0')}`;
    const record = { id, apt_id, name, phone, age, gender, reason, type, date, alt_date, time_slot, status:'pending', source, created_at:new Date().toISOString() };
    db.get('appointments').push(record).write();
    res.status(201).json({ id, apt_id, message:'Appointment booked successfully' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.patch('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = db.get('appointments').find({ id }).value();
    if (!existing) return res.status(404).json({ error: 'Appointment not found' });
    
    const allowed = ['status', 'notes', 'date', 'alt_date', 'time_slot', 'name', 'phone', 'type', 'reason', 'age', 'gender'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
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
