require('dotenv').config();
const { Worker } = require('bullmq');
const pool = require('./db');
const IORedis = require('ioredis');

const email = require('./email');
const connection = new IORedis(process.env.REDIS_URL, {maxRetriesPerRequest: null});

const emailWorker = new Worker('emailQueue', async (job) => {
    console.log(`📩 Processing job: ID ${job.id}`);

    const { recipient, subject, content } = job.data;

    try {
        await email.sendEmail(subject, recipient, content);

        await pool.query('UPDATE emails SET status = $1 WHERE recipient = $2 AND subject = $3', ['sent', recipient, subject]);

        console.log(`✅ Email sent to ${recipient}`);
    } catch (error) {
        console.error(`❌ Failed to send email to ${recipient}`, error);
        throw error;  // Ensures the job is marked as failed and retried
    }
}, { connection});  // Use the same Redis connection

// ✅ Fix: Ensure correct event listeners
emailWorker.on('error', (err) => console.error('🚨 Worker error:', err));
emailWorker.on('completed', (job) => console.log(`🎉 Job completed: ID ${job.id}`));

console.log('🚀 Email worker started...');
