const express = require('express');
const router = express.Router();

const userController = require('../controllers/api/admin/UserController');
//  const upload = require("../middlewares/adminProfileUpload");



// user route
router.post('/user-type-list', userController.user_type_list);



module.exports = router;
