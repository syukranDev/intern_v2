const express = require('express')
const app = express();
const logger =  require('./logger/logger')

require('dotenv').config();
const PORT = process.env.SERVER_PORT 

const { runCronJob } = require('./cronjobs/cron.js');
const ProductRouter = require('./router/ProductRouter.js')
const AuthRouter = require('./router/AuthRouter.js')
const FileRouter = require('./router/FileRouter.js')

app.use(express.json()) //need to include to read POST API payload
app.use('/api/product', ProductRouter)
app.use('/api/auth', AuthRouter)
app.use('/api/file', FileRouter)


app.get('/welcome_onboard/:name', (req, res) => {
    // let name = req.query.name
    let name = req.params.name
    res.send({ message : `Welcome to onboard, ${name ?? 'Not Available'}`})
});

// Enable below to run 
// runCronJob();

app.use((req, res, next) => {
    res.status(404).json({ error: 'API path does not exist' });
});

app.use (function (err, req, res, next){
    logger.error(err.stack);
    if (err) res.status(400).json({ message: 'Invalid JSON'});
    else next();
});

app.listen(PORT, () => {
    console.log(`Connected to my server at PORT(${PORT})`)
})

// module.exports = app
