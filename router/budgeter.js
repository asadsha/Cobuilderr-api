"use strict";

const HttpStatus = require("http-status-codes");

const expressRouter = require("express").Router();

const budgeterHandler = require("../handlers/budgeter");
const verifyJwt = require("../middlewares/middleware").verifyUser;

class Budgeter {
  constructor() {
    this.router = expressRouter;

    // Define the functionality for various HTTP the methods, of the various "Budgeter" routes:
    this.definePath_getBudgeterItems();
  }
  //Define the path for GET Method /budgeter/:userid to get items and data //////
  definePath_getBudgeterItems() {
    this.router.get("/", verifyJwt, (request, response) => {
      budgeterHandler
        .getBudgeter(request.user.userId)
        .then(phases => {
          response.status(HttpStatus.OK).json({ phases });
        })
        .catch(Error => {
          response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
        });
    });
  }
}

module.exports = new Budgeter();
