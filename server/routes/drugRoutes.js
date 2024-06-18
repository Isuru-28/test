// routes/drugRoutes.js

const express = require('express');
const router = express.Router();
const { getDrugsToBill, getNearestExpireItems } = require('../controllers/drugController');

// router.get('/drug/:prescriptionId', getDrugsByPrescriptionId);
router.get('/drug/bill', getDrugsToBill);

router.get('/drug/NearestExpireItems', getNearestExpireItems);

module.exports = router;
