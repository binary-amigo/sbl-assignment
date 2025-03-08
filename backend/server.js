require('dotenv').config();
const express = require('express');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/emails', emailRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
