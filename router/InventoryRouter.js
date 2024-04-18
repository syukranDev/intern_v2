const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const logger = require('../logger/logger')
const db = require('../model/db.js');
const verifyToken = require('../middlewares/authMiddleware.js');
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

// GET all inventory api/inventory/list (PROTECTED)
router.get('/list/all', verifyToken, async (req, res) => {
    let data;

    try {
      data = await db.inventory.findAndCountAll({
        // attributes: ['id'],
        logging: console.log
      })

    } catch (e) {
        console.error(e)
    }

    return res.send({ status: 'sucess', data})
})


//GET api/inventory/o/:id
router.get('/o/:id', verifyToken, async (req, res) => {
    let inventoryId = req.params.id
    if (!inventoryId) return res.status(422).send({ errMsg: 'Missing inventory id in the url'})
    let singleInventory;

    try {
        let isInventoryExist = await db.inventory.findOne({
            where: {
                id: inventoryId
            }
        })

        if (!isInventoryExist) return res.status(422).send({ errMsg: 'Id is not valid'})

        singleInventory = await db.inventory.findOne({
            where: {
                id: inventoryId
            }
        })
    
    } catch (e) {
        console.error(e)
    }

    return res.send({
        status: 'success',
        data: singleInventory
    })
})

// POST - api/inventory/add
router.post('/add', verifyToken,  async (req, res) => { 
    console.log(req.body)
    let name = req.body.name
    let description = req.body.desc
    let type = req.body.type
    let quantity = req.body.quantity

    if (quantity <= 0)  return res.status(422).send({ errMsg: 'Quantity cannot be less than 0'})
    if (!name || !description || !type || !quantity) return res.status(422).send({ errMsg: 'Missing payload'})


    let transaction;

    try {
        transaction = await sq.transaction();

        await db.inventory.create({
            id: uuidv4(),
            name,
            desc: description,
            type, 
            quantity,
            status: 'active',
            created_by: 'system-create',
            updated_by : 'system-create',
        }, transaction)

        await transaction.commit();

    } catch (e) {
        if (transaction) await transaction.rollback();
        console.error(e)
    }
    return res.send({ status: 'success', message: 'Successfully created new inventory data.'})
})

// POST - api/inventory/update
router.post('/update', verifyToken,  async (req, res) => { 
    let inventoryId = req.query.id
    let description = req.body.desc

    if (!description) return res.status(422).send({ errMsg: 'Missing payload'})
    
    let isInventoryIdExist = await db.inventory.findOne({
        where: {
            id : inventoryId
        }
    })

    if (!isInventoryIdExist) return res.status(422).send({ errMsg: 'Inventory Id provided not exist!'})

    let transaction;

    try {
        transaction = await sq.transaction();

        await db.inventory.update({
            desc: description
        }, {
            where: {
                id : inventoryId
            }
        }, transaction)

        await transaction.commit()

    } catch (e) {
        if (transaction) await transaction.rollback();
        console.error(e)
        return res.status(500).send({errMsg: 'Internal Server Error, Please contact administrator.'})
    }

    return res.status(200).send({ status: 'success', message: `Inventory ID - ${inventoryId} is updated successfully`})
})


// GET - api/inventory/delete/:id
router.get('/delete/:id', verifyToken, async (req, res) => { 
    let inventoryId = req.params.id

    if (!inventoryId) return res.status(422).send({errMsg: 'Missing inventory Id'})

    let transaction;

    try {
        transaction = await sq.transaction();

        let isInventoryIdExist = await db.inventory.findOne({
            where: {
                id : inventoryId
            }
        })

        if (!isInventoryIdExist) return res.status(422).send({errMsg: 'Inventory Id is not exist, please use another id'})

        await db.inventory.destroy({
            where: {
                id: inventoryId
            }
        }, {transaction, logging: console.log})

        await transaction.commit();

    } catch (e) {
        if (transaction) await transaction.rollback();
        console.error(e)
        return res.status(500).send({errMsg: 'Internal Server Error, Please contact administrator.'})
    }

    return res.status(200).send({ status: 'success', message: `Inventory ID - ${inventoryId} is successfully deleted.`})

})
module.exports  = router