require('dotenv').config();
const { Queue } = require('bullmq');
const pool = require('../db');
const redis = require('../redis');

const emailQueue = new Queue('emailQueue', { connection: redis });

const email = require('../email');

const sendEmail = async (req, res) => {
    const { recipient, subject, content } = req.body;
    try {
        await email.sendEmail(subject, recipient, content);

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
        const scheduleDate = new Date(schedule_time); // Ensure correct conversion
        const delay = scheduleDate - Date.now();

        if (delay <= 0) {
            return res.status(400).json({ error: "Schedule time must be in the future" });
        }

        const job = await emailQueue.add('send-email', { recipient, subject, content }, { delay });

        console.log(`✅ Job added: ID ${job.id}, Delay: ${delay} ms`);
        
        await pool.query(
            'INSERT INTO emails (recipient, subject, body, status, schedule_time) VALUES ($1, $2, $3, $4, $5)', 
            [recipient, subject, content, 'scheduled', schedule_time]
        );

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
