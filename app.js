require("dotenv").config();
const express = require("express");
const socketIO = require("socket.io");
const app = express();
const http = require("http");
const port = process.env.PORT || 5000;

let server = http.createServer(app);
app.get("/", (req, res) => res.send("<h1>Hello World From Express</h1>"));

let io = socketIO(server);

io.on("connection", (socket) => {
  console.log("new connection established");
  socket.on("join", (client) => {
    socket.name = client.name;
    // use the room property to create a room
    socket.join(client.room);
    console.log(`${socket.name} has joined ${client.room}`);
  });
});

// will pass 404 to error handler
app.use((req, res, next) => {
  const error = new Error("No such route found");
  error.status = 404;
  next(error);
});
// error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

server.listen(port, () => console.log(`starting on port ${port}`));
