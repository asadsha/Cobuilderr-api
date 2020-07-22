var express = require("express");

var app = express();

var http = require("http").Server(app);

createApiServer = (port, callback) => {
  http.listen(port, () => {
    console.log("Server Started ON port " + port);
    callback(app);
  });
};

var io = require("socket.io")(http);

module.exports = { createApiServer, io };
