const express     = require('express');
const router      = express.Router();
const dataService = require('../db/dataService');

function generateMeetCode() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const rand = (n) => Array.from({ length: n }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  return `${rand(3)}-${rand(4)}-${rand(3)}`;
}

router.get('/', async (req, res) => {
  try {
    const list = await dataService.getAppointments();
    res.json(list);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, phone, age='', gender='', reason='', type='In-Person', date, alt_date='', time_slot, source='website', meet_link } = req.body;
    if (!name || !phone || !date || !time_slot)
      return res.status(400).json({ error: 'Name, phone, date and time_slot are required' });

    let assignedMeetLink = (meet_link || '').trim();
    if (type === 'Video Call') {
      if (!assignedMeetLink) {
        const content = await dataService.getContent();
        const configuredMeet = (content?.profile?.googleMeetLink || '').trim();
        assignedMeetLink = configuredMeet || `https://meet.google.com/${generateMeetCode()}`;
      }
    } else {
      assignedMeetLink = '';
    }

    const record = await dataService.createAppointment({
      name,
      phone,
      age,
      gender,
      reason,
      type,
      date,
      alt_date,
      time_slot,
      source,
      meet_link: assignedMeetLink
    });

    res.status(201).json({ id: record.id, apt_id: record.apt_id, meet_link: assignedMeetLink, message: 'Appointment booked successfully' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const allowed = ['status', 'notes', 'date', 'alt_date', 'time_slot', 'name', 'phone', 'type', 'reason', 'age', 'gender', 'meet_link'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // Auto-assign Google Meet link if switched to Video Call without link
    if (updates.type === 'Video Call' && !updates.meet_link) {
      const content = await dataService.getContent();
      const configuredMeet = (content?.profile?.googleMeetLink || '').trim();
      updates.meet_link = configuredMeet || `https://meet.google.com/${generateMeetCode()}`;
    }
    updates.updated_at = new Date().toISOString();

    const updated = await dataService.updateAppointment(id, updates);
    if (!updated) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment updated successfully', appointment: updated });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await dataService.deleteAppointment(id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
