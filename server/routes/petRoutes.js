const express = require('express');
const { getPets, getPetDetailsById, updatePetDetails } = require('../controllers/petController');

const router = express.Router();

router.get('/pets', getPets);
router.get('/pets/:petId', getPetDetailsById);
router.put('/pets/:petId', updatePetDetails);

module.exports = router;
