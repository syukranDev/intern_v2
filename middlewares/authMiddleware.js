const jwt = require('jsonwebtoken')
require('dotenv').config()

let secretKey = process.env.JWT_SECRET_KEY

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(401).send({ errMsg: 'Invalid or expired token.'})
        }

        req.user = decoded// this one optional

        next();
    })
}

module.exports = verifyToken