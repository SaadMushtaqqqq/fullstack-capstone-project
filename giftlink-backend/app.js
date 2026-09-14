/*app.js*/
const express = require('express');
const cors = require('cors');
const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');
const connectToDatabase = require('./models/db');
const logger = require('./logger');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDatabase().then(() => {
    logger.info('Connected to database');
}).catch((e) => console.error('Failed to connect to database', e));

// Route Mounting
app.use('/api/gifts', giftRoutes);

// Task 7: Route that serves /api/search
app.use('/api/search', searchRoutes);

app.use('/api/auth', authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3060;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
