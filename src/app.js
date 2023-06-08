const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');

dotenv.config();
const app = express();
mongoose.connect(process.env.MONGODB_URI_PRESCRIPTIONS || 'mongodb://receipts:receipts@localhost:27017/receipts');
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}));

require('./models/Prescription');
require('./models/User');

app.use(require('./routes'));

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!');
})

app.listen(PORT, (error) => {
    if(!error) {
        console.log(`Server side is running on port ${PORT}`)
    } else {
        console.log("Error: ", error);
    }
})

module.exports = app;