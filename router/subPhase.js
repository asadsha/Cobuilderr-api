"use strict";

const HttpStatus = require("http-status-codes");

const expressRouter = require("express").Router();

const itemsHandler = require("../handlers/items");
const verifyJwt = require("../middlewares/middleware").verifyUser;

class Items {
  constructor() {
    this.router = expressRouter;

    // Define the functionality for various HTTP the methods, of the various "user phase items" routes:
    this.definePath_getItems();
  }
  //   //Define the path for GET Method /items to get all items //////
  definePath_getItems() {
    this.router.get("/:phaseid", verifyJwt, (request, response) => {
      if (!request.params.phaseid) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json("phaseid attributes must be included in request params");
      } else {
        itemsHandler
          .getItems(request.params.phaseid)
          .then(items => {
            response.status(HttpStatus.OK).json({ items });
          })
          .catch(Error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          });
      }
    });
  }
}
module.exports = new Items();
