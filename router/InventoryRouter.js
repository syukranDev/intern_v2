const express = require('express');
const router = express.Router();
const logger = require('../logger/logger')
const db = require('../model/db.js');
const Op = db.Sequelize.Op;
const sq = db.sequelize;

router.get('/', async (req, res) => {
    // let data = {
    //     id: 12,
    //     inventoryName: 'Chocolate Box',
    //     quantity: 54
    // }

    // logger.info(data)

    const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
    const data =  await response.json();

    return res.send({ status: 'success', data})
})

router.get('/list', async (req, res) => {
    let data, transaction;

    try {
        transaction = await sq.transaction();

        data = await db.inventory.findAndCountAll({
            raw: true,
            logging: console.log
        })

        return res.send({ status: 'success', data: data})

    } catch (err) {
        console.log(err)
    }
})

module.exports  = router