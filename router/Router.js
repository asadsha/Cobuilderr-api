/// Implements the API's Router:

"use strict";

const userRouter = require("./user");
const adminRouter = require("./admin");
const checklistRouter = require("./checklist");
const documentRouter = require("./document");
const apiRouter = require("./api");
const phaseRouter = require("./phase");
const subphaseRouter = require("./subPhase");
const budgeterRouter = require("./budgeter");

module.exports = class Router {
  // Getter for the user' Router:
  //
  static get userRouter() {
    return userRouter;
  }

  // Getter for the admin' Router:
  //
  static get adminRouter() {
    return adminRouter;
  }

  // Getter for the api' Router:
  //
  static get apiRouter() {
    return apiRouter;
  }

  // Getter for the checklist' Router:
  //
  static get checklistRouter() {
    return checklistRouter;
  }

  // Getter for the document' Router:
  //
  static get documentRouter() {
    return documentRouter;
  }

  // Getter for the phase' Router:
  //
  static get phaseRouter() {
    return phaseRouter;
  }

  // Getter for the subphase' Router:
  //
  static get subphaseRouter() {
    return subphaseRouter;
  }

  // Getter for the subphase' Router:
  //
  static get budgeterRouter() {
    return budgeterRouter;
  }
};
