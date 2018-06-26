const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
let clients=[];
let clientsInfo=[];
let cerradas=0;
const io = socketIo(server); // < Interesting!
io.on("connection", socket => {
  console.log("New client connected");
  clients.push(socket);
  socket.emit("FromAPI", 10);
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
    console.log(data);
  });

  socket.on("Change", data => {
  emit("FromAPI",20);
		});
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
  console.log(clients.length+" "+clientsInfo.length);
  res.send("ok");
});
app.get("/api/play", (req, res) => 
{
  console.log("play");
  var question = {text:"¿Cuál es el valor?", abierta:false, op1:"opción1", op2:"opción2", op3:"opción3", op4:"opción4"};
  emit("question",question);
});
