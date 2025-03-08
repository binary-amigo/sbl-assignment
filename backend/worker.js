require('dotenv').config();
const { Worker } = require('bullmq');
const { Resend } = require('resend');
const pool = require('./db');
const redis = require('./redis');

const resend = new Resend(process.env.RESEND_API_KEY);

const emailWorker = new Worker('emailQueue', async job => {
    const { recipient, subject, content } = job.data;

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: recipient,
            subject,
            text: content,
        });

        await pool.query('UPDATE emails SET status = $1 WHERE recipient = $2 AND subject = $3', ['sent', recipient, subject]);

        console.log(`Email sent to ${recipient}`);
    } catch (error) {
        console.error(`Failed to send email to ${recipient}`, error);
    }
}, { connection: redis });

console.log('Email worker started...');

module.exports = emailWorker;

