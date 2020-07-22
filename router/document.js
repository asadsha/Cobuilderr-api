"use strict";

const HttpStatus = require("http-status-codes");

const expressRouter = require("express").Router();

const documentHandler = require("../handlers/document");
const verifyJwt = require("../middlewares/middleware").verifyUser;

class Checklist {
  constructor() {
    this.router = expressRouter;

    // Define the functionality for various HTTP the methods, of the various document routes:
    this.definePath_addDocumentFolder();
    this.definePath_deleteDocumentFolder();
    this.definePath_updateDocumentFolder();
    this.definePath_getDocuments();
    this.definePath_addDocumentFile();
    this.definePath_deleteDocumentFile();
  }

  //Define the path for Post Method  to add a new document folder//////
  definePath_addDocumentFolder() {
    this.router.post("/", verifyJwt, (request, response) => {
      // console.log(request.body.checklist);
      if (!request.body.folderName) {
        response.status(HttpStatus.BAD_REQUEST).json({
          Message: "folder name Must be Defined in request body"
        });
      } else {
        documentHandler
          .addDocumentFolder(
            request.body.folderName,
            request.user.userId,
            request.user.userType
          )
          .then(documentFolder => {
            response.status(HttpStatus.OK).json({ documentFolder });
          })
          .catch(Error => {
            response
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ Message: Error });
          });
      }
    });
  }

  //   //Define the path for DELETE Method  to delete document folder//////
  definePath_deleteDocumentFolder() {
    this.router.delete("/:id", verifyJwt, (request, response) => {
      if (!request.params.id || !request.body.creator) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            "id of user and folder's creator type  must be included in request "
          );
      } else {
        if (
          request.user.userType === "user" &&
          request.body.creator === "admin"
        ) {
          response
            .status(HttpStatus.BAD_REQUEST)
            .json("You can't delete the folders created by admin");
        } else {
          documentHandler
            .deleteDocumentFolder(request.params.id)
            .then(user => {
              response.status(HttpStatus.OK).json({
                message: "Folder Deleted Successfully"
              });
            })
            .catch(Error => {
              response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
            });
        }
      }
    });
  }

  //Define the path for get Method  to get a documents by userid //////
  definePath_getDocuments() {
    this.router.get("/", verifyJwt, (request, response) => {
      documentHandler
        .getDocuments(request.user.userId)
        .then(documents => {
          response.status(HttpStatus.OK).json({ documents });
        })
        .catch(Error => {
          response
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ Message: Error });
        });
    });
  }

  //   //Define the path for PATCH Method to update documentFolder //////
  definePath_updateDocumentFolder() {
    this.router.patch("/:id", verifyJwt, (request, response) => {
      if (
        !request.params.id ||
        !request.body.folderName ||
        !request.body.creator
      ) {
        response.status(HttpStatus.BAD_REQUEST).json({
          Message:
            "id params and folder name and creator must be specified in request body"
        });
      } else {
        if (
          request.user.userType === "user" &&
          request.body.creator === "admin"
        ) {
          response
            .status(HttpStatus.BAD_REQUEST)
            .json("You can't update the files created by admin");
        } else {
          documentHandler
            .updateDocumentFolder(request.params.id, request.body.folderName)
            .then(newDocument => {
              response.status(HttpStatus.OK).json(newDocument);
            })
            .catch(Error => {
              response
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ Message: Error });
            });
        }
      }
    });
  }

  //   // //Define the path for Delete Method   to DELETE a pdf file by its id //////

  definePath_deleteDocumentFile() {
    this.router.delete("/:docid/pdf/:id", verifyJwt, (request, response) => {
      if (
        !request.params.id ||
        !request.params.docid ||
        !request.body.creator
      ) {
        response.status(HttpStatus.BAD_REQUEST).json({
          Message:
            "pdf's id , folder id and creator of document and Must be Defined in request"
        });
      } else {
        if (
          request.user.userType === "user" &&
          request.body.creator === "admin"
        ) {
          response
            .status(HttpStatus.BAD_REQUEST)
            .json("You can't delete the files created by admin");
        } else {
          documentHandler
            .deleteDocumentFile(request.params.docid, request.params.id)
            .then(doc => {
              response.status(HttpStatus.OK).json({
                message: "pdf Deleted Successfully"
              });
            })
            .catch(Error => {
              response
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ Message: Error });
            });
        }
      }
    });
  }

  //Define the path for Post Method to add a new pdf file in folder//////
  definePath_addDocumentFile() {
    this.router.post(
      "/:docid/pdf",
      // this.upload.single("pdfurl"),
      verifyJwt,
      (request, response) => {
        if (
          !request.params.docid ||
          !request.body.pdfurl ||
          !request.body.folderCreator
        ) {
          response
            .status(HttpStatus.BAD_REQUEST)
            .json(
              "folder id , pdf file  attributes must be included in request body"
            );
        } else {
          if (
            request.user.userType === "user" &&
            request.body.folderCreator === "admin"
          ) {
            response
              .status(HttpStatus.BAD_REQUEST)
              .json("You can't add the files in folder created by admin");
          } else {
            // if (request.body.imageUrl !== "") {
            // console.log(request.file);
            // awsHandler
            //   .UploadToAws(request.file)
            //   .then(url => {
            const document = {
              pdfurl: request.body.pdfurl,
              creator: request.user.userType
            };
            documentHandler
              .addDocumentFile(
                document,
                request.params.docid
                // url
              )
              .then(user => {
                response.status(HttpStatus.OK).json({ user });
              })
              .catch(Error => {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
              });
          }
          // })
          // .catch(Error => {
          //   response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          // });
          // }
        }
      }
    );
  }
}

module.exports = new Checklist();
