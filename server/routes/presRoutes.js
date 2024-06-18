const express = require('express');
const router = express.Router();
const presController = require('../controllers/presController');

// Route to get drugs for the prescription form dropdown
router.get('/drugs/form', presController.getDrugsToForm);

// Route to add a prescription record
router.post('/prescriptions', presController.addPrescriptions);

// Route to get prescriptions by petId
router.get('/prescriptions/:pet_id', presController.getPrescriptionsByPetId);

// Delete a prescription record
router.delete('/prescriptions/:id', presController.deletePrescription);

// Route to fetch prescription records by prescription ID
router.get('/prescriptions/record/:pres_id', presController.getPrescriptionRecords);


module.exports = router;
