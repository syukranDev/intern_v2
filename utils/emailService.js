const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: '<YOUR EMAIL HERE>',
        pass: '<YOUR EMAIL APP PASSWORD HERE><'
    }

})

async function sendAnEmail(toEmail, subject, text){
    const mailOptions = {
        from: '<YOUR EMAIL HERE>',
        to: toEmail,
        subject: subject,
        text, text
    }

    try {
        let sendEmail =  await transporter.sendMail(mailOptions)

        console.log('Email sent')
        console.log(sendEmail.response)

        return true

    } catch(err) {
        console.error('Error sending email')
        console.error(err)
        throw Error
    }
}

module.exports = { sendAnEmail }