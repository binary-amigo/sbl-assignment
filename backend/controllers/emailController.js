require('dotenv').config();
const { Resend } = require('resend');
const { Queue } = require('bullmq');
const pool = require('../db');
const redis = require('../redis');

const emailQueue = new Queue('emailQueue', { connection: redis });

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (req, res) => {
    const { recipient, subject, content } = req.body;
    try {
        const {data, error} = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: recipient,
            subject,
            text: content,
        });

        console.log(data, error);

        await pool.query('INSERT INTO emails (recipient, subject, body, status) VALUES ($1, $2, $3, $4)', [recipient, subject, content, 'sent']);

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};

const scheduleEmail = async (req, res) => {
    const { recipient, subject, content, schedule_time } = req.body;

    try {
        await emailQueue.add('send-email', { recipient, subject, content }, { delay: new Date(schedule_time) - Date.now() });

        // Store in DB
        await pool.query('INSERT INTO emails (recipient, subject, body, status, schedule_time) VALUES ($1, $2, $3, $4, $5)', 
        [recipient, subject, content, 'scheduled', schedule_time]);

        res.status(200).json({ message: 'Email scheduled successfully!' });
    } catch (error) {
        console.error('Error scheduling email:', error);
        res.status(500).json({ error: 'Failed to schedule email' });
    }
};

const getEmailLogs = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM emails ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching email logs:', error);
        res.status(500).json({ error: 'Failed to fetch email logs' });
    }
};

module.exports = { sendEmail, scheduleEmail, getEmailLogs };
