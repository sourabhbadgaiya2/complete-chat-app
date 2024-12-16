const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle any custom events here if needed
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

module.exports = socketHandler;
