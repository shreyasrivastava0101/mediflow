const express = require('express');
const router = express.Router();
const { admitPatient, getPatients, getPatientQueue, updatePatient, deletePatient, updateQueuePriority } = require('../controllers/patientController');
const { protect } = require('../middleware/auth');

router.post('/', protect, admitPatient);
router.get('/', protect, getPatients);
router.get('/queue', protect, getPatientQueue);
router.put('/:id', protect, updatePatient);
router.delete('/:id', protect, deletePatient);
router.put('/:id/priority', protect, updateQueuePriority);

module.exports = router;
