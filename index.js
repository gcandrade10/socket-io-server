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

let clients=[];
let clientsInfo=[];
let cerradas=0;
let abiertas=0;
let activeGame=false;

app.use(function (req, res, next) {

   // Website you wish to allow to connect
   res.setHeader('Access-Control-Allow-Origin', '*');

   // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

   // Request headers you wish to allow
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

   // Set to true if you need the website to include cookies in the requests sent
   // to the API (e.g. in case you use sessions)
   res.setHeader('Access-Control-Allow-Credentials', true);

   // Pass to next layer of middleware
   next();
});

app.use(express.static(path.join(__dirname, 'socket-io-client/build')));

app.get('*', (req, res) => {
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
  console.log("play");
  var question = {text:"¿Cuál es el valor con el que más identificas a Uniandes?", abierta:false, op1:"Libertad", op2:"Excelencia", op3:"Solidaridad", op4:"Integridad"};
  emit("question",question);
});
