//Set up Variables
const express = require('express');
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver);
let plrs = []
let users = []

//Make the home screen
app.use("/", express.static(path.join(__dirname, "main/home/")));

//Listen for the server to start
httpserver.listen(3000, () => {
  console.log("Server Started")
});

//Connect to each client
io.on('connection', function(socket) {
  if (socket.handshake.headers['x-replit-user-name'] !== ""){
    socket.emit("loggedIn","ok")
    plrs[plrs.length] = socket.id
    users[plrs.indexOf(socket.id)] = socket.handshake.headers['x-replit-user-name']
  socket.broadcast.emit("playerJoin", plrs.indexOf(socket.id),users[plrs.indexOf(socket.id)])

  for (let val in plrs) {
    if (plrs[val]!==socket.id){
      socket.emit("playerJoin", val,users[val])
    }
  }
  
  socket.on("disconnecting", function(){
    socket.broadcast.emit("playerLeave", plrs.indexOf(socket.id))
    plrs[plrs.indexOf(socket.id)] = undefined
  })

  socket.on("move", (ratioX,ratioY)=>{
    socket.broadcast.emit("playerMove", plrs.indexOf(socket.id), ratioX, ratioY)
  })

  socket.on("mouseDown", ()=>{
    socket.broadcast.emit("playerMouseDown", plrs.indexOf(socket.id))
  })

  socket.on("mouseUp", ()=>{
    socket.broadcast.emit("playerMouseUp", plrs.indexOf(socket.id))
  })
  } else {
    socket.emit("loggedIn",false)
  }
})