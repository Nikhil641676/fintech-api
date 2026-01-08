const express = require('express');
const router = express.Router();

const adminController = require('../controllers/api/admin/AdminController');
 const upload = require("../middlewares/adminProfileUpload");



// Admin Register
router.post('/register', adminController.register);
router.post('/update',upload.single("profile_image"), adminController.update);


module.exports = router;
