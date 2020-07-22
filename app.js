//Entry Point for the api

const express = require("express");
var bodyParser = require("body-parser");
const server = require("./server");
// const compression = require("compression");
(cors = require("cors")),
  (config = require("./config/config")),
  (mongoose = require("mongoose"));

//for handlers
const messageHandler = require("./handlers/messages");

//Connect to the Mongodb Database
var url = config.DbUrl;
mongoose.connect(url, { useCreateIndex: true, useNewUrlParser: true }, function(
  err
) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to Database on url: " + url);
  }
});
mongoose.set("useFindAndModify", false);

const port = process.env.PORT || config.PORT;

server.createApiServer(port, api => {
  const Router = require("./router/Router");

  // use CORS middleware, for cross-domain requests,
  api.use(cors());

  // api.use(compression({ filter: shouldCompress }));

  // add middleware to parse incoming requests that have JSON payloads,
  api.use(express.json());

  //Define the user routes
  api.use("/user", Router.userRouter.router);

  //Define the api routes
  api.use("/api", Router.apiRouter.router);

  //Define the admin routes
  api.use("/admin", Router.adminRouter.router);

  //Define the checklist routes
  api.use("/checklist", Router.checklistRouter.router);

  //Define the document routes
  api.use("/document", Router.documentRouter.router);

  //Define the budgeter routes
  api.use("/budgeter", Router.budgeterRouter.router);

  //Define the phase routes
  api.use("/phase", Router.phaseRouter.router);

  //Define the subphase routes
  api.use("/items", Router.subphaseRouter.router);

  //Deifine The Error Handler EndPoint For Invalid Resource
  api.use("*", (req, res, next) => {
    res.json({
      Success: false,
      message: "Invalid Api Resource Name or HTTP method for resource"
    });
  });
  api.use("/", (req, res, next) => {
    res.json({
      Success: true,
      message: "Welcome to cobuilder api"
    });
  });
});

// // socket.on("event", function(data) {});
// const paramss = {
//   text: "hello its first message from admin",
//   sender: {
//     name: "admin",
//     avatar: "jfkdhjksjksks",
//     idd: "8736478236825689354588"
//   },
//   receiver: {
//     name: "shah",
//     idd: "8736478236825689354588"
//   }
// };

// // socket.on("event", function(data) {});
// const params = {
//   text: "hello its first message from shah",
//   sender: {
//     name: "shah",
//     avatar: "jfkdhjksjksks",
//     idd: "8736478236825689354589"
//   },
//   receiver: {
//     name: "admin",
//     idd: "8736478236825689354589"
//   }
// };

// //section for handling socket....
// var { io } = require("./server");
// //serve
// io.on("connection", function(socket) {
//   // console.log("server side connected");
//   socket.on("disconnect", function(msg) {
//     console.log("server side disconnected");
//   });
//   socket.on("create message", function(params, callback) {
//     callback(
//       "new message creation request received on server by " + params.sender.name
//     );
//     messageHandler
//       .createMessage(params)
//       .then(res => {
//         // console.log("inside handler success");
//         io.emit("new message", params);
//       })
//       .catch(err => {
//         console.log("inside handler can't send");
//         socket.emit("can not send message", params);
//       });
//   });
// });

// //client
// var socket = require("socket.io-client")("http://localhost:9091");
// socket.on("connect", function() {
//   console.log("shah connected");
// });

// //creating message
// socket.emit("create message", params, msg => {
//   console.log(msg);
// });

// //receiving message
// socket.on("new message", function(msg) {
//   // console.log(msg.receiver.name);
//   if (msg.receiver.name === "shah") {
//     console.log("receiving this message on shah'side from admin " + msg.text);
//   }
// });
// //disconnect
// socket.on("disconnect", function() {
//   console.log("shah disconnected");
// });

// //client 2
// var socket = require("socket.io-client")("http://localhost:9091");
// socket.on("connect", function() {
//   console.log("admin connected");
// });

// //creating message
// socket.emit("create message", paramss, msg => {
//   console.log(msg);
// });

// //receiving message
// socket.on("new message", function(msg) {
//   // console.log(msg.receiver.name);
//   if (msg.receiver.name === "admin") {
//     console.log("receiving this message on admin'side from client" + msg.text);
//   }
// });
// //disconnect
// socket.on("disconnect", function() {
//   console.log("client disconnected");
// });
