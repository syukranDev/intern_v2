const jwt = require('jsonwebtoken')
require('dotenv').config()

let secretKey = process.env.JWT_SECRET_KEY

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token)

    if (!token) return res.status(401).send({
        errMsg: 'Forbidden, no token provided.'
    })

    jwt.verify(token, secretKey, (err, decoded) => {
        // if (err) {
        //     console.log(err)
        //     return res.status(401).send({ errMsg: 'Invalid or expired token.'})
        // }

        // req.token = decoded.userLoggedIn// this one optional

        next();
    })
}

module.exports = verifyToken