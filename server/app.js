require("dotenv").config();
const express = require("express");

const app = express();

// cors
const cors = require("cors");
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

//database
require("./config/database").connectDb();

//logger
const logger = require("morgan");
app.use(logger("tiny"));

// bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pass io instance to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// routes
app.use("/", require("./routes/messageRoutes"));

// Create HTTP and Socket.IO server
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socket");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Use the socket handler
socketHandler(io);

// server listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
