// routes/appointmentRoutes.js
const express = require('express');
const { getAvailableSlots, bookAppointment, editAppointment, getAppointmentsByUserId, getAllAppointments,acceptAppointment, markUnavailable, markAvailable, completeAppointment, getAppointmentsToday} = require('../controllers/appointmentController');
const router = express.Router();

// Route to get available slots for a specific date
router.get('/appointments/available/:date', getAvailableSlots);

// Route to book an appointment
router.post('/appointments/book', bookAppointment);

// Route to edit an appointment (only admin or receptionist)
router.put('/appointments/edit/:appid', editAppointment);

// Route to fetch appointments for a specific user
router.get('/appointments/user/:user_Id', getAppointmentsByUserId);

// Route to fetch all appointments
router.get('/appointments/all', getAllAppointments);

router.put('/appointments/accept/:appid', acceptAppointment);
// router.put('/appointments/reject/:appid', rejectAppointment);
router.put('/appointments/complete/:appid', completeAppointment);
// Route for marking a time slot as unavailable (for admins and receptionists)
router.post('/appointments/mark-unavailable', markUnavailable);
router.delete('/appointments/mark-available', markAvailable);

router.get('/appointments/AppointmentsToday',getAppointmentsToday)

module.exports = router;
