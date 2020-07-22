"use strict";

const HttpStatus = require("http-status-codes");

const expressRouter = require("express").Router();

const phaseHandler = require("../handlers/phase");
const verifyJwt = require("../middlewares/middleware").verifyUser;

class Phase {
  constructor() {
    this.router = expressRouter;

    // Define the functionality for various HTTP the methods, of the various "user phase items" routes:
    this.definePath_getPhases();
  }
  definePath_getPhases() {
    this.router.get("/:userid", verifyJwt, (request, response) => {
      if (!request.params.userid) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json("userid attribute must be included in request body");
      } else {
        phaseHandler
          .getPhases(request.params.userid)
          .then(phases => {
            response.status(HttpStatus.OK).json({ phases });
          })
          .catch(Error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          });
      }
    });
  }
}
module.exports = new Phase();
