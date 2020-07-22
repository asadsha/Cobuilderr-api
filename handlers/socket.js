var { io } = require("./server");

io.on("connection", function(socket) {
  console.log("and server server side connected");
  socket.on("disconnect", function(msg) {
    console.log("server side disconnected");
  });
  socket.on("chat message", function(msg) {
    console.log(msg);
  });
});
