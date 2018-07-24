const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const index = require("./routes/inde");
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
const path = require('path');
var cors = require('cors')

let clients=[];
let clientsInfo=[];
let cerradas=0;
let abiertas=0;
let activeGame=false;

var corsOptions = {
  origin: 'https://uniandes.herokuapp.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.options('*', cors());

app.use(express.static(path.join(__dirname, 'socket-io-client/build')));

app.get('*',cors(corsOptions), (req, res) => {
  console.log(__dirname,'entro aca');
  res.sendFile(path.join(__dirname+'/socket-io-client/build/index.html'));
});

io.on("connection", socket => {
  
  console.log("New client connected");
  clients.push(socket);
  socket.on("disconnect", () => console.log("Client disconnected"));

  socket.on("Registro", data => {
    console.log(data);
    clientsInfo.push(data);
    emit("clients",clientsInfo);
  });

  socket.on("cerrada", data => {
    cerradas++;
    if(cerradas===clientsInfo.length)
    {
      var question = {text:"¿Por qué es el valor?", abierta:true};
      emit("question",question);    }
  });

  socket.on("EntradaBD", data => {
    console.log("guardando en bd "+data);
    abiertas++;
    console.log("abiertas",abiertas);
    console.log("clientes",clientsInfo.length);
    if(abiertas===clientsInfo.length)
    {
      emit("end","Te damos la bienvenida y te invitamos a vivir diariamente los valores Uniandes.");
      activeGame=false;
      console.log("bienvenida");
      abiertas=0;
      clients=[];
      clientsInfo=[];
    }
  });
  
  if(!activeGame)
  {
    socket.emit("bienvenida","Aun no hay un juego para unirse");
  }
});

const emit= (key,newValue)=>
{
	console.log(clients.length);
	for (i = 0; i < clients.length; i++) {
		clients[i].emit(key, newValue);
	}
};

server.listen(port, () => console.log(`Listening on port ${port}`));

// Put all API endpoints under "/api"
app.get("/api/reset", (req, res) => 
{
  var origin = req.get('origin'); 
     res.header('Access-Control-Allow-Origin', origin);
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header('Access-Control-Allow-Headers', 'Content-Type');
  console.log(clients.length+" "+clientsInfo.length);
  clientsInfo=[];
  cerradas=0;
  activeGame=true;
  console.log(clients.length+" "+clientsInfo.length);
  res.send("ok");
  emit("start","");
  console.log("start");
});

app.get("/api/play", (req, res) => 
{
  var origin = req.get('origin'); 
     res.header('Access-Control-Allow-Origin', origin);
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header('Access-Control-Allow-Headers', 'Content-Type');
  console.log("play");
  var question = {text:"¿Cuál es el valor con el que más identificas a Uniandes?", abierta:false, op1:"Libertad", op2:"Excelencia", op3:"Solidaridad", op4:"Integridad"};
  emit("question",question);
});
