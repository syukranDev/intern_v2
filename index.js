const express = require('express')
const app = express();
const logger =  require('./logger/logger')

require('dotenv').config();
const PORT = process.env.SERVER_PORT 

const { runCronJob } = require('./cronjobs/cron');
const InventoryRouter = require('./router/InventoryRouter')

app.use('/api/inventory', InventoryRouter)

app.use (function (err, req, res, next){
    logger.error(err.stack);
    if (err) res.status(400).json({ message: 'Invalid JSON'});
    else next();
});

// Enable below to run 
// runCronJob();

app.listen(PORT, () => {
    console.log(`Connected to my server at PORT(${PORT})`)
})
