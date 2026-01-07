const express = require('express');
const router = express.Router();

const adminController = require('../controllers/api/admin/AdminController');

// Admin Register
router.post('/register', adminController.register);
router.post('/update', adminController.update);

module.exports = router;
