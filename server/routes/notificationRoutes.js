// routes/notificationRoutes.js

const express = require('express');
const { getAllNotifications, addNotification, getNotificationsByPetId, clearNotifications, deleteNotification} = require('../controllers/notificationController');

const router = express.Router();

router.get('/notifications', getAllNotifications);
router.post('/notifications', addNotification);
// router.delete('/notifications/:nid', deleteNotification);

router.get('/notifications/pet/:petId', getNotificationsByPetId);
router.delete('/notifications/pet/:userId/clear', clearNotifications);
router.delete('/notifications/:notificationId', deleteNotification);

module.exports = router;
