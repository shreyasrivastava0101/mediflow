const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorSchedule, bookSlot, cancelSlot } = require('../controllers/doctorController');

router.get('/', getDoctors);
router.get('/:id/schedule', getDoctorSchedule);
router.post('/:id/book', bookSlot);
router.put('/:id/cancel/:appId', cancelSlot);

module.exports = router;
