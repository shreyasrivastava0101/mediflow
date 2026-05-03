const express = require('express');
const router = express.Router();
const { seedDatabase } = require('../controllers/mockDataController');

router.post('/', seedDatabase);

module.exports = router;
