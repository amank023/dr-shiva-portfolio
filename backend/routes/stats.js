const express = require('express');
const router  = express.Router();
const { db }  = require('../db/database');

router.get('/', (req, res) => {
  try {
    const appointments = db.get('appointments').value() || [];
    const reviews      = db.get('reviews').value() || [];
    const messages     = db.get('messages').value() || [];
    const chatLogs     = db.get('chat_logs').value() || [];

    const pendingApts   = appointments.filter(a => a.status === 'pending').length;
    const confirmedApts = appointments.filter(a => a.status === 'confirmed').length;
    const completedApts = appointments.filter(a => a.status === 'completed').length;
    const cancelledApts = appointments.filter(a => a.status === 'cancelled').length;

    const unreadMessages = messages.filter(m => !m.read).length;
    const avgRating      = reviews.length ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1) : '5.0';

    const recentAppointments = db.get('appointments').sortBy('created_at').reverse().take(5).value();
    const recentMessages     = db.get('messages').sortBy('created_at').reverse().take(5).value();
    const recentReviews      = db.get('reviews').sortBy('created_at').reverse().take(5).value();

    res.json({
      counts: {
        totalAppointments: appointments.length,
        pendingAppointments: pendingApts,
        confirmedAppointments: confirmedApts,
        completedAppointments: completedApts,
        cancelledAppointments: cancelledApts,
        totalReviews: reviews.length,
        avgRating,
        totalMessages: messages.length,
        unreadMessages,
        totalChatLogs: chatLogs.length
      },
      recent: {
        appointments: recentAppointments,
        messages: recentMessages,
        reviews: recentReviews
      }
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
