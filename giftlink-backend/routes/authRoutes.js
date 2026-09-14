const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// User Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Task 11: Call collection's findOne method to locate current user
        const theUser = await collection.findOne({ email: email });

        if (!theUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const checkPassword = await bcryptjs.compare(password, theUser.password);
        if (!checkPassword) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const userName = theUser.firstName;
        const userEmail = theUser.email;
        const authtoken = jwt.sign({ email: userEmail, name: userName }, JWT_SECRET);

        res.json({ authtoken, email: userEmail, userName });
    } catch (e) {
        return res.status(500).send('Internal Server Error: ' + e.message);
    }
});

module.exports = router;
