const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const index = require("./routes/inde");
const app = express();
const server = http.createServer(app);
const io = socketIO(server); // < Interesting!
const path = require('path');
var cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

var username = process.env.USERNAMEMONGO || 'alejandro';
var password = process.env.PASSWORD || 'basededatos1';

const MONGO_URL = 'mongodb://'+username+':'+password+'@ds245901.mlab.com:45901/bienvenida';
console.log(MONGO_URL);
MongoClient.connect(MONGO_URL, (err, database) => {  
  if (err) {
    return console.log(err);
  }
  const db = database.db('bienvenida');
  var collection = db.collection('usuarios');
  // Do something with db here, like inserting a record
  collection.insertOne(
    {
      title: 'Hello MongoDB',
      text: 'Hopefully this works!'
    },
     (err, res, db) => {
      if (err) {
        return console.log(err);
      }
    }
  )
});

let clients=[];
let clientsInfo=[];
let cerradas=0;
let abiertas=0;
let activeGame=false;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);

app.use(express.static(path.join(__dirname, 'socket-io-client/build')));
/**
app.get('*', (req, res) => {
  console.log(__dirname,'entro aca');
  res.sendFile(path.join(__dirname+'/socket-io-client/build/index.html'));
});
**/

io.on("connection", socket => {
  
  console.log("New client connected");

  clients.push(socket);

  socket.on("disconnect", () => console.log("Client disconnected"));

/**
**CLIENT LINE
**/
//From state 0 to state 1
socket.on("Register", data => {
  clientsInfo.push(data);
  io.emit("clients",clientsInfo);

});
//From state 6 to 3
socket.on("question1", data => {
    cerradas++;
    if(cerradas===clientsInfo.length)
    {      
      var question = {text:"Arroja una pelota en el cilindro con el valor que elegiste."};
      emit("question2",question);    
      cerradas=0;    
    }
  });
//From state 6 to 4
socket.on("question2", data => {
    cerradas++;
    if(cerradas===clientsInfo.length)
    {
      var question = {text:"¿Cómo definirías ese valor?"};
      emit("question3",question);
    }
  });
//From state 4 to 5
socket.on("save", data => {
    abiertas++;
    if(abiertas>=clientsInfo.length)
    {
      emit("final",clientsInfo);
      activeGame=false;
      abiertas=0;
      cerradas=0;
      clients=[];
      clientsInfo=[];
    }
  });
/**
** ADMIN LINE
**/
//From state 0 to state 1
app.get("/api/reset", (req, res) => 
{
  console.log("reset");
  activeGame=true;
  abiertas=0;
  cerradas=0;
  clients=[];
  clientsInfo=[];
  io.emit("beggining",[]);
  res.send("ok");
});
//From state 1 to 2
app.get("/api/play", (req, res) => 
{
  console.log("play");
  var question = {text:"¿Cuál es el valor con el que más identificas a Uniandes?", abierta:false, op1:"Libertad", op2:"Excelencia", op3:"Solidaridad", op4:"Integridad"};
  emit("question1",question);
  res.send("ok");
});

const emit= (key,newValue) =>
{
	for (i = 0; i < clients.length; i++) {
		clients[i].emit(key, newValue);
	}
};

});
server.listen(port, () => console.log(`Listening on port ${port}`));