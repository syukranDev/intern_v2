const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const logger = require('../logger/logger.js')
const db = require('../model/db.js');
const Op = db.Sequelize.Op;
const sq = db.sequelize;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
require('dotenv').config()

let secretKey =  process.env.JWT_SECRET_KEY;

// POST - api/user/register
router.post('/register', async (req, res) => {
    const { username, password, confirm_password } = req.body;
    if (!username || !password || !confirm_password)
        return res.status(400).json({ message: 'Username, password, and confirm_password required' });

    if (password !== confirm_password)
        return res.status(400).json({ message: 'Password and confirm_password do not match' });

    let transaction;

    try {
        transaction = await sq.transaction();

        const existingUser = await db.users.findOne({ where: { username } });
        if (existingUser)
            return res.status(409).json({ message: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.users.create({ 
            username, 
            password: hashedPassword, 
            role: 'user' 
        }, { transaction });

        await transaction.commit();
        res.json({ status: 'success', message: 'User registered successfully' });
    } catch (err) {
        if (transaction) await transaction.rollback();
        console.error(err);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// POST - api/user/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: 'Username and password required' });

    try {
        const user = await db.users.findOne({ where: { username } });
        if (!user)
            return res.status(401).json({ message: 'Invalid username or password' });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(401).json({ message: 'Invalid username or password' });

        const token = jwt.sign({ username: user.username, role: user.role }, secretKey, { expiresIn: '1h' });
        res.json({ status: 'success', token });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: 'Login failed' });
    }
});


module.exports  = router