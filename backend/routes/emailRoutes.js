const express = require('express');
const { sendEmail, scheduleEmail, getEmailLogs } = require('../controllers/emailController');
const router = express.Router();

router.post('/send', sendEmail);
router.post('/schedule', scheduleEmail);
router.get('/logs', getEmailLogs);

module.exports = router;
