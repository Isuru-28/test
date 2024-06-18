// routes/authRoutes.js
const express = require('express');
const {registerPetOwner, registerPetOwnerByAdmin, registerUserByAdmin, login, logout } = require('../controllers/authController');

const router = express.Router();

// router.post('/register/internal/admin', registerAdmin);
router.post('/register/pet-owner', registerPetOwner);
router.post('/register/admin/pet-owner', registerPetOwnerByAdmin); 
router.post('/register/admin', registerUserByAdmin);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
