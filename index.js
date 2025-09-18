const express = require('express')
const app = express();
const logger =  require('./logger/logger')

require('dotenv').config();
const PORT = process.env.SERVER_PORT 

const { runCronJob } = require('./cronjobs/cron');
const InventoryRouter = require('./router/InventoryRouter')
const AuthRouter = require('./router/AuthRouter')
const FileRouter = require('./router/FileRouter')

app.use(express.json()) //need to include to read POST API payload
app.use('/api/inventory', InventoryRouter)
app.use('/api/auth', AuthRouter)
app.use('/api/file', FileRouter)

app.use (function (err, req, res, next){
    logger.error(err.stack);
    if (err) res.status(400).json({ message: 'Invalid JSON'});
    else next();
});

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


app.listen(PORT, () => {
    console.log(`Connected to my server at PORT(${PORT})`)
})

// module.exports = app
