const app = require('express')
const router = app.Router()

const sensorModel = require('../models/sensor')

router.get('/', (req, res) => {
    res.send('get data');
});

module.exports = router