const express = require('express');
const router = express.Router();
const db = require('../database/config');
const { v4: uuidv4 } = require('uuid');

// Get notifications for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const [notifications] = await db.query(
      'SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 100',
      [req.params.userId]
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});

// Get unread count
router.get('/user/:userId/unread-count', async (req, res) => {
  try {
    const [result] = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND isRead = FALSE',
      [req.params.userId]
    );
    res.json({ count: result[0].count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
});

// Mark notification as read
router.put('/:notificationId/read', async (req, res) => {
  try {
    await db.query(
      'UPDATE notifications SET isRead = TRUE WHERE id = ?',
      [req.params.notificationId]
    );
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
});

// Mark all notifications as read for a user
router.put('/user/:userId/read-all', async (req, res) => {
  try {
    await db.query(
      'UPDATE notifications SET isRead = TRUE WHERE userId = ?',
      [req.params.userId]
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking all notifications as read', error: error.message });
  }
});

// Create notification (internal use)
router.post('/', async (req, res) => {
  try {
    const { userId, title, message, type, relatedId } = req.body;
    const id = uuidv4();
    
    await db.query(
      'INSERT INTO notifications (id, userId, title, message, type, relatedId, isRead) VALUES (?, ?, ?, ?, ?, ?, FALSE)',
      [id, userId, title, message, type, relatedId || null]
    );

    res.status(201).json({ id, userId, title, message, type, relatedId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
});

module.exports = router;
