const app = require('express')
const router = app.Router()

const sensorModel = require('../models/sensor')

router.post('/', async(req, res) => {
    const sensor = new sensorModel({
        temp: req.body.temperature,
        humi: req.body.humidity
    })
    try {
        const newSensor = await sensor.save()
        res.status(201).json(newSensor)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

router.get('/', (req, res) => {
    res.send('get data');
});

module.exports = router