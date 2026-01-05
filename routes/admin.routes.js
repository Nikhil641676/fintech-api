const express = require('express');
const router = express.Router();

const adminController = require('../controllers/api/admin/AdminController');

// Admin Register
router.post('/register', adminController.register);

module.exports = router;
