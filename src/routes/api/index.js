const express = require('express');
const router = express.Router();

router.use('/prescriptions', require('./prescription'))
router.use('/users', require('./user'))

module.exports = router;