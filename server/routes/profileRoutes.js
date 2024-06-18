const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');

// Fetch user details based on user ID and role
router.get('/user/profile/:id/:user_role', getUserProfile);

// Update user profile details
router.put('/user/profile/:id/:user_role', updateUserProfile);

module.exports = router;
