// notificationController.js

const db = require('../db');

// Get all notifications
exports.getAllNotifications = async (req, res) => {
    try {
      const [notifications] = await db.query('SELECT * FROM notifications');
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Server error' });
    }
};

// Add a new notification
exports.addNotification = async (req, res) => {
  try {
    const { message, petId, userId } = req.body;

    // Validate the input data
    if (!message || !petId || !userId) {
      return res.status(400).json({ error: 'Message, petId, and userId are required.' });
    }

    // Insert the new notification into the database
    const result = await db.query(
      'INSERT INTO notifications (message, pet_id, user_id) VALUES (?, ?, ?)',
      [message, petId, userId]
    );

    const newNotificationId = result.insertId;

    res.status(201).json({
      message: 'Notification added successfully',
      notificationId: newNotificationId,
    });
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// // Delete a notification
// exports.deleteNotification = async (req, res) => {
//     const { nid } = req.params;
  
//     try {
//       // Delete the notification from the database
//       await db.query('DELETE FROM notifications WHERE nid = ?', [nid]);
  
//       // Send a success response
//       res.status(200).json({ message: 'Notification deleted successfully' });
//     } catch (error) {
//       // If an error occurs, send an error response
//       console.error('Error deleting notification:', error);
//       res.status(500).json({ message: 'Server error', error });
//     }
// };

// Get notifications by pet ID
exports.getNotificationsByPetId = async (req, res) => {
  const { petId } = req.params;

  try {
      const [rows] = await db.query('SELECT nid, message, created_at FROM notifications WHERE pet_id = ? ORDER BY created_at DESC', [petId]);
      res.status(200).json(rows);
  } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Server error' });
  }
};


// Clear all notifications for a particular pet
exports.clearNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
      await db.query('DELETE FROM notifications WHERE pet_id = ?', [userId]);
      res.status(200).json({ message: 'All notifications cleared successfully' });
  } catch (error) {
      console.error('Error clearing notifications:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

// Delete a specific notification
exports.deleteNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
      await db.query('DELETE FROM notifications WHERE nid = ?', [notificationId]);
      res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ message: 'Server error' });
  }
};
