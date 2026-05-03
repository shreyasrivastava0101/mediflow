const express = require('express');
const router = express.Router();
const { bookAppointment, getMyAppointments } = require('../controllers/appointmentController');

router.post('/', bookAppointment);
router.get('/', getMyAppointments);

module.exports = router;
