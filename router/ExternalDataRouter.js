const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const logger = require('../logger/logger.js')
const db = require('../model/db.js');
const Op = db.Sequelize.Op;
const sq = db.sequelize;
const jwt = require('jsonwebtoken')
const axios = require('axios');
require('dotenv').config()


// GET - api/external_data/fetch
router.get('/fetch', async (req, res) => {
    try {
        const response = await axios.get('https://v2.jokeapi.dev/joke/Any?type=single');
        // res.json({
        //     status: 'success',
        //     data: response.data
        // });


        await db.webhook_3rd_party.create({
            id: uuidv4(),
            source_url: 'https://v2.jokeapi.dev/joke/Any?type=single',
            data: JSON.stringify(response.data)
        })


        res.json({
            status: 'Successfully fetched and saved external data into database',
            data: response.data
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch external data',
            error: error.message
        });
    }
})

module.exports  = router