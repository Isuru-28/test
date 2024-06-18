const express = require('express');
const { getDrugs, addDrug, deleteDrug, updateDrug, getCurrentStock } = require('../controllers/inventoryController');

const router = express.Router();

// Route to add a new drug
router.get('/drugs', getDrugs);
router.post('/drugs', addDrug);
router.delete('/drugs/:drugId', deleteDrug);
router.put('/drugs/:drugId', updateDrug);
router.get('/drugs/currentStock',getCurrentStock)

module.exports = router;
