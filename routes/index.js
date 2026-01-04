const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    res.json({ status: true, message: 'API working fine' });
});

// Other routes
// router.use('/auth', require('./auth.routes'));
// router.use('/recharge', require('./recharge.routes'));

module.exports = router;   // ⭐ MOST IMPORTANT
