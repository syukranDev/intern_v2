const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const logger = require('../logger/logger.js')
const db = require('../model/db.js');
const verifyToken = require('../middlewares/authMiddleware.js');
const Op = db.Sequelize.Op;
const sq = db.sequelize;

// POST - api/product/add
router.post('/new', async (req, res) => { 

    // console.log(req.body)
    let { name, description, origin_country, quantity, price, expiry_date } = req.body


    let transaction;

    try {
        transaction = await sq.transaction();

        await db.products.create({
            id: uuidv4(),
            name,
            description: description,
            origin_country,
            quantity,
            price,
            expiry_date,
            status: 'active',
            created_by: 'system',
            updated_by : 'system',
        }, transaction)

        await transaction.commit();

    } catch (e) {
        if (transaction) await transaction.rollback();
        console.error(e)
        return res.status(500).send({errMsg: 'Internal Server Error'});
    }
    return res.send({ status: 'success', message: 'Successfully created new product data.'})
})

// GET all inventory api/inventory/list (PROTECTED)
// router.get('/list/all', verifyToken, async (req, res) => {
//     let data;

//     try {
//       data = await db.inventory.findAndCountAll({
//         // attributes: ['id'],
//         logging: console.log
//       })

//     } catch (e) {
//         console.error(e)
//     }

//     return res.send({ status: 'sucess', data})
// })

//GET api/product/o/:id
// router.get('/o/:id', verifyToken, async (req, res) => {
//     let inventoryId = req.params.id
//     if (!inventoryId) return res.status(422).send({ errMsg: 'Missing inventory id in the url'})
//     let singleInventory;

//     try {
//         let isInventoryExist = await db.inventory.findOne({
//             where: {
//                 id: inventoryId
//             }
//         })

//         if (!isInventoryExist) return res.status(422).send({ errMsg: 'Id is not valid'})

//         singleInventory = await db.inventory.findOne({
//             where: {
//                 id: inventoryId
//             }
//         })
    
//     } catch (e) {
//         console.error(e)
//     }

//     return res.send({
//         status: 'success',
//         data: singleInventory
//     })
// })

// POST - api/product/update
// router.post('/update', verifyToken,  async (req, res) => { 
//     let inventoryId = req.query.id
//     let description = req.body.desc

//     if (!description) return res.status(422).send({ errMsg: 'Missing payload'})
    
//     let isInventoryIdExist = await db.inventory.findOne({
//         where: {
//             id : inventoryId
//         }
//     })

//     if (!isInventoryIdExist) return res.status(422).send({ errMsg: 'Inventory Id provided not exist!'})

//     let transaction;

//     try {
//         transaction = await sq.transaction();

//         await db.inventory.update({
//             desc: description
//         }, {
//             where: {
//                 id : inventoryId
//             }
//         }, transaction)

//         await transaction.commit()

//     } catch (e) {
//         if (transaction) await transaction.rollback();
//         console.error(e)
//         return res.status(500).send({errMsg: 'Internal Server Error, Please contact administrator.'})
//     }

//     return res.status(200).send({ status: 'success', message: `Inventory ID - ${inventoryId} is updated successfully`})
// })


// GET - api/product/delete/:id
// router.get('/delete/:id', verifyToken, async (req, res) => { 
//     let inventoryId = req.params.id

//     if (!inventoryId) return res.status(422).send({errMsg: 'Missing inventory Id'})

//     let transaction;

//     try {
//         transaction = await sq.transaction();

//         let isInventoryIdExist = await db.inventory.findOne({
//             where: {
//                 id : inventoryId
//             }
//         })

//         if (!isInventoryIdExist) return res.status(422).send({errMsg: 'Inventory Id is not exist, please use another id'})

//         await db.inventory.destroy({
//             where: {
//                 id: inventoryId
//             }
//         }, {transaction, logging: console.log})

//         await transaction.commit();

//     } catch (e) {
//         if (transaction) await transaction.rollback();
//         console.error(e)
//         return res.status(500).send({errMsg: 'Internal Server Error, Please contact administrator.'})
//     }

//     return res.status(200).send({ status: 'success', message: `Inventory ID - ${inventoryId} is successfully deleted.`})

// })
module.exports  = router