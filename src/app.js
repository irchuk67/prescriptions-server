const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const app = express();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://receipts:receipts@localhost:27017/receipts');
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}));

require('./models/Prescription');
require('./models/User');

app.use(require('./routes'));

app.listen(PORT, (error) => {
    if(!error) {
        console.log(`Server side is running on port ${PORT}`)
    } else {
        console.log("Error: ", error)
    }
})

module.exports = app;