const express = require('express');
const { getUsers, deleteUser, updateUser } = require('../controllers/userController');

const router = express.Router();

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);

module.exports = router;
