/// Implements the router for "/Auth" route:

const HttpStatus = require("http-status-codes");

const expressRouter = require("express").Router();

const userHandler = require("../handlers/user");

const verifyJwt = require("../middlewares/middleware").verifyUser;

("use strict");

class User {
  constructor() {
    this.router = expressRouter;

    // Define the functionality for various HTTP the methods, of the various
    // "/user" routes:

    this.definePath_signin();
    this.definePath_addPinterest();
    this.definePath_deletePinterest();
  }

  //   //Define the path for POST Method /user/signin  //////
  definePath_signin() {
    this.router.post("/signin", (request, response) => {
      if (!request.body.email || !request.body.password) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            "email and password attributes must be included in request body"
          );
      } else {
        userHandler
          .signinUser(request.body)
          .then(user => {
            response.status(HttpStatus.OK).json({ Token: user.token });
          })
          .catch(Error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          });
      }
    });
  }

  //   //Define the path for POST METHOD to add and update pinterest credentials //////
  definePath_addPinterest() {
    this.router.post("/pinterest/:id", verifyJwt, (request, response) => {
      if (
        !request.body.pinterestUserName ||
        !request.body.pinterestBoardName ||
        !request.params.id
      ) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            "user's id in params and username and boardname of pinterest attributes must be included in request body"
          );
      } else {
        userHandler
          .updatePinterestCredentials(request.params.id, request.body)
          .then(user => {
            response.status(HttpStatus.OK).json({ user });
          })
          .catch(Error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          });
      }
    });
  }

  //   //Define the path for DELETE Method  to DELETE pinterest credentials //////
  definePath_deletePinterest() {
    this.router.patch("/pinterest/:id", verifyJwt, (request, response) => {
      if (!request.params.id) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json("user's id attribute must be included in request params");
      } else {
        userHandler
          .deletePinterestCredentials(request.params.id)
          .then(user => {
            response.status(HttpStatus.OK).json({ user });
          })
          .catch(Error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          });
      }
    });
  }
}

module.exports = new User();
