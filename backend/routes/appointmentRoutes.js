const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Routes cho quản lý lịch hẹn
router.get('/', appointmentController.getAppointments);
router.get('/available-slots', appointmentController.getAvailableSlots);
router.get('/:id', appointmentController.getAppointmentById);
router.post('/', appointmentController.createAppointment);
router.put('/:id/status', appointmentController.updateStatus);

module.exports = router; 