const mongoose = require('mongoose');
const sensorSchema = new mongoose.Schema({
    temp: { type : Number, required: true },
    humi: { type : Number, required: true },
    time : { type : Date, default: Date.now }
})
module.exports = mongoose.model('Sensor', sensorSchema)