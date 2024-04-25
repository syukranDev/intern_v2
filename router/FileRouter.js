const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const logger = require('../logger/logger.js')
const db = require('../model/db.js');
const verifyToken = require('../middlewares/authMiddleware.js');
const Op = db.Sequelize.Op;
const sq = db.sequelize;

const multer = require('multer');
const upload = multer({ dest: 'uploads/'});
const fs = require('fs')

const { sendAnEmail } = require('../utils/emailService.js')

router.post('/upload', upload.single('file'), async (req, res) => {

    let uploadedFile = req.file
    let fileName = req.file.originalname
    let email = req.body.email

    console.log(req.file)

    if (!email) return res.status(400).send({ errMsg: 'No email in the form'})
    if (!uploadedFile) return res.status(400).send({ errMsg: 'No file uploaded'})

    if (uploadedFile.mimetype !== 'text/plain') {
        fs.unlinkSync(uploadedFile.path) //delete the old file
        return res.status(400).send({ errMsg: 'Only text file is allowed'})
    }

    fs.readFile(uploadedFile.path, 'utf8', async (err, data) => {
        if (err) return res.status(400).send({ errMsg: 'Error reading a file'})

        if (data) {
            let transaction;

            try {
                transaction = await sq.transaction();
                // First, insert into database file details

                await db.file_uploads.create({
                    file_name: fileName,
                    file_path: `uploads/${fileName}`
                })

                await transaction.commit();

                //Then, send an email to user
                let subject = 'Test Email from API'
                let text = `This is an email testing, the content of the file uploaded is <br> <h1>${data}</h1>`

                await sendAnEmail(email, subject, text)

                return res.send({ 
                    status: 'success',
                    message: 'File uploaded and emailed successfully',
                    fileName: fileName,
                    fileData: data
                })
            } catch(e) {
                if(transaction) await transaction.rollback();
                console.error(e)
                return res.status(500).send({ errMsg: 'Error to upload file and send an email'})
            }
        }
    })

})

module.exports  = router

