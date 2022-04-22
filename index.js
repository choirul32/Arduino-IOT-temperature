require('dotenv').config()
const path = require('path')
const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

const server = require('http').createServer(app);
const io = require("socket.io")(server, {cors: {origin:"*"}});

app.set("views", path.join(__dirname+"/views"))
app.set("view engine", "ejs")
app.engine('html',require('ejs').renderFile)
app.set('view engine', 'html')
app.use("/public", express.static(path.join(__dirname + "/public")))

//connection mongodb
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true, useUnifiedTopology:true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))
//-----------------

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sensorRouter = require('./controllers/sensorController')
app.use("/temp", sensorRouter)

app.get('/', (req, res) => {
    res.render('index')
})

server.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

const sensorModel = require('./models/sensor')
let dataGlobal = {'temp':0, 'humi':0}

io.on("connection", (socket) => {
    try {
        console.log("tersambung")
        socket.on("updateData", (data) => {
            dataGlobal.temp = data.temp
            dataGlobal.humi = data.humi
            socket.broadcast.emit("showData",data)
        })
    } catch (error) {
        console.log(error)
    }
})

async function saveData(){
    const data = new sensorModel(dataGlobal)
    data.save()
    console.log('data save to mongo')
}
  
setInterval(saveData, 10000)