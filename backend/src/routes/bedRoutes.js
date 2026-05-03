const express = require('express');
const router = express.Router();
const { getBeds, releaseBed, reassignBed } = require('../controllers/bedController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getBeds);
router.put('/:id/release', protect, releaseBed);
router.put('/:id/reassign', protect, reassignBed);

module.exports = router;
