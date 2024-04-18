const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const logger = require('../logger/logger.js')
const db = require('../model/db.js');
const Op = db.Sequelize.Op;
const sq = db.sequelize;
const jwt = require('jsonwebtoken')
require('dotenv').config()

let secretKey =  process.env.JWT_SECRET_KEY;

// GET - api/auth/login
router.get('/login', async (req, res) => {
    let userLoggedIn = {
        username: 'syukran'
    }

    const token = jwt.sign({ userLoggedIn }, secretKey , { expiresIn: '15m'})

    return res.send({ status: 'success', token})
})

module.exports  = router