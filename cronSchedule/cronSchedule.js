
const cron          =   require('node-cron');
const cronBinance   =   require('../crons/binance');

//run after every 2 sec
cron.schedule('*/4 * * * * *', () => {
        
    // cronBinance.price();
});

cron.schedule('0 0 */1 * * *', () => {
    // cron.schedule('*/4 * * * * *', () => {
    
    // cronBinance.balanceUpdate();
});


cron.schedule('*/5 * * * * *' , () => {

    cronBinance.volume();
})


