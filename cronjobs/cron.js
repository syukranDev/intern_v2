const cron = require('node-cron');

function runCronJob() {
    console.log('Cron job scheduled');
    cron.schedule('*/2 * * * * *', () => {
        console.log('Cron job executed!');
    });
}

module.exports = { runCronJob };
