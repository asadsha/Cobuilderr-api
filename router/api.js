("use strict");
const multer = require("multer");
const HttpStatus = require("http-status-codes"),
  expressRouter = require("express").Router(),
  awsHandler = require("../handlers/aws");

const documentHandler = require("../handlers/document");

class Api {
  constructor() {
    this.router = expressRouter;

    const storage = multer.memoryStorage();
    this.upload = multer({
      storage: storage
    });

    // Define the functionality for various HTTP the methods, of the various
    // "/api" routes:
    this.definePath_basepath();
    this.definePath_uploadpath();
  }

  definePath_basepath() {
    this.router.get("/", (request, response, next) => {
      response.status(HttpStatus.OK).json({
        message: "Welcome To Co-builder Api",
        apiVersion: "1.0.0"
      });
    });
  }

  definePath_uploadpath() {
    this.router.post(
      "/upload",
      this.upload.single("pdf"),

      (request, response, next) => {
        if (!request.file) {
          response
            .status(HttpStatus.BAD_REQUEST)
            .json("File must be Defined in request file-data");
        } else {
          awsHandler
            .UploadToAws(request.file)
            .then(url => {
              response.status(HttpStatus.OK).json(url);
            })
            .catch(Error => {
              response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
            });
        }
      }
    );
  }
}

module.exports = new Api();
