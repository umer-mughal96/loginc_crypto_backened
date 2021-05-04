const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv')
const colors = require('colors')
const cors = require('cors')
const connectDB = require('./config/db');



//User Routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');







const app = express();
app.use(morgan('dev'))
app.use(cors())
app.use(express.json({extended : false}))
dotenv.config({path : 'config/config.env'})




connectDB();
const PORT = process.env.PORT || 3001 ;




//User Routes
app.use('/logiccrypto/api/v1/auth',authRoute)
app.use('/logiccrypto/api/v1/user',userRoute)







app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});