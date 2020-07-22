"use strict";

const HttpStatus = require("http-status-codes");

const expressRouter = require("express").Router();

const checklistHandler = require("../handlers/checklist");
const verifyJwt = require("../middlewares/middleware").verifyUser;

class Checklist {
  constructor() {
    this.router = expressRouter;

    // Define the functionality for various HTTP the methods, of the various "admin" routes:
    this.definePath_addChecklist();
    this.definePath_getChecklists();
    // this.definePath_getChecklist();
    this.definePath_deleteChecklist();
    this.definePath_updateChecklist();
    this.definePath_updateChecklistStatus();
  }

  //   // Define the path for get Method /checklist to get all checklists of user and also progress//////

  definePath_getChecklists() {
    this.router.get("/", verifyJwt, (request, response) => {
      checklistHandler
        .getChecklists(request.user.userId)
        .then(checklists => {
          response.status(HttpStatus.OK).json({ checklists });
        })
        .catch(Error => {
          response
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ Message: Error });
        });
    });
  }

  //Define the path for Post Method /checklist/ to add a new checklist//////
  definePath_addChecklist() {
    this.router.post("/", verifyJwt, (request, response) => {
      // console.log(request.body.checklist);
      if (!request.body.checklist.name || !request.body.checklist.dueDate) {
        response.status(HttpStatus.BAD_REQUEST).json({
          Message:
            "checklist (name, month, dueDate) Object Must be Defined in request body"
        });
      } else {
        checklistHandler
          .addChecklist(request.body.checklist, request.user.userId)
          .then(checklist => {
            response.status(HttpStatus.OK).json({ checklist });
          })
          .catch(Error => {
            response
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ Message: Error });
          });
      }
    });
  }

  //   //Define the path for get Method /checklist/:id  to get a checklist by its id //////
  //   definePath_getchecklist() {
  //     this.router.get("/checklist/:id", verifyJwt, (request, response) => {
  //       if (!request.params.id) {
  //         response
  //           .status(HttpStatus.BAD_REQUEST)
  //           .json("checklist id Must be Defined in request params");
  //       } else {
  //         checklistHandler
  //           .getchecklist(request.params.id)
  //           .then(checklist => {
  //             response.status(HttpStatus.OK).json({ checklist });
  //           })
  //           .catch(Error => {
  //             response
  //               .status(HttpStatus.INTERNAL_SERVER_ERROR)
  //               .json({ Message: Error });
  //           });
  //       }
  //     });
  //   }

  //   // //Define the path for Delete Method /checklist/:id  to DELETE a checklist by its id //////

  definePath_deleteChecklist() {
    this.router.delete("/:id", verifyJwt, (request, response) => {
      if (!request.params.id) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json({ Message: "checklist id Must be Defined in request params" });
      } else {
        checklistHandler
          .deleteChecklist(request.params.id, request.user.userId)
          .then(checklist => {
            response.status(HttpStatus.OK).json({
              message: "checklist Deleted Successfully"
            });
          })
          .catch(Error => {
            response
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ Message: Error });
          });
      }
    });
  }

  //   //Define the path for PATCH Method /checklist/:id to UPDATE a checklist //////

  definePath_updateChecklist() {
    this.router.patch("/:id", verifyJwt, (request, response) => {
      if (
        !request.params.id ||
        !request.body.checklist ||
        !request.body.checklist.name ||
        !request.body.checklist.description ||
        !request.body.checklist.dueDate
      ) {
        response.status(HttpStatus.BAD_REQUEST).json({
          Message:
            "checklist id Must be Defined in request params and name, description and duedate must be specified in request body"
        });
      } else {
        checklistHandler
          .updateChecklist(
            request.params.id,
            request.user.userId,
            request.body.checklist
          )
          .then(newchecklist => {
            response.status(HttpStatus.OK).json(newchecklist);
          })
          .catch(Error => {
            response
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ Message: Error });
          });
      }
    });
  }

  //   //Define the path for PATCH Method /checklist/updatestatus/:id to UPDATE a checklist status //////
  definePath_updateChecklistStatus() {
    this.router.patch("/updatestatus/:id", verifyJwt, (request, response) => {
      if (!request.params.id || !request.body.state) {
        response.status(HttpStatus.BAD_REQUEST).json({
          Message: "checklist id and state Must be Defined in params"
        });
      } else {
        checklistHandler
          .updateChecklistStatus(
            request.params.id,
            request.user.userId,
            request.body.state
          )
          .then(status => {
            response.status(HttpStatus.OK).json(status);
          })
          .catch(Error => {
            response
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ Message: Error });
          });
      }
    });
  }
}

module.exports = new Checklist();
