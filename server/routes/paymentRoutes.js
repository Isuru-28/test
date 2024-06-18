const express = require('express');
const router = express.Router();
const { calculateBill, savePayment, getAllPayments, deletePayment, getPaymentsByPetId, getTodayEarnings, getMonthEarnings, getEarningsYesterday, getPaymentsByMonthYear, getTotalPreviousNextMonthIncome } = require('../controllers/paymentController');

// Route to calculate bill for unregistered pets
router.post('/payments/calculate', calculateBill);

// Route to save payment details
router.post('/payments/savepayment', savePayment);

// Route to fetch all payment records
router.get('/payments/records', getAllPayments);

// Route to delete a specific payment record by ID
router.delete('/payments/:id', deletePayment);

// Route to fetch payments by pet ID
router.get('/payments/pet/:pet_id', getPaymentsByPetId);

router.get('/payments/earnings/today',getTodayEarnings);

router.get('/payments/earnings/month',getMonthEarnings);

router.get('/payments/earnings/yesterday',getEarningsYesterday);

router.get('/payments/PaymentsByMonthYear', getPaymentsByMonthYear);

router.get('/payments/presum',getTotalPreviousNextMonthIncome);

module.exports = router;
