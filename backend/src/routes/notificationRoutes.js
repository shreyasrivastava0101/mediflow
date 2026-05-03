const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, clearAll } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.delete('/', protect, clearAll);

module.exports = router;
