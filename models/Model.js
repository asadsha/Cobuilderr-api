/// Implements the API's Model:
"use strict";

const userModel = require("./user");

const adminModel = require("./admin");

const checklistModel = require("./checklist");

const itemsModel = require("./items");

const documentModel = require("./document");

const phaseModel = require("./phase");

const messageModel = require("./message");

module.exports = class Model {
  //Getter For User's Model
  static get userModel() {
    return userModel;
  }

  //Getter For adminModel
  static get adminModel() {
    return adminModel;
  }

  //Getter For itemsModel
  static get itemsModel() {
    return itemsModel;
  }

  //Getter For checklist Model
  static get checklistModel() {
    return checklistModel;
  }

  //Getter For message Model
  static get messageModel() {
    return messageModel;
  }

  //Getter For document  Model
  static get documentModel() {
    return documentModel;
  }

  //Getter For phase Model
  static get phaseModel() {
    return phaseModel;
  }
};
