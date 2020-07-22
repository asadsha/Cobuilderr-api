/// Implements the router for "/Auth" route:

const HttpStatus = require("http-status-codes");

const multer = require("multer");
const awsHandler = require("../handlers/aws");
const expressRouter = require("express").Router();

//handlers
const userHandler = require("../handlers/user");
const adminHandler = require("../handlers/admin");
const itemsHandler = require("../handlers/items");
const checklistHandler = require("../handlers/checklist");
const documentHandler = require("../handlers/document");
const phaseHandler = require("../handlers/phase");
const budgeterHandler = require("../handlers/budgeter");

const verifyJwt = require("../middlewares/middleware").verifyUser;

("use strict");

class Admin {
  constructor() {
    this.router = expressRouter;
    const storage = multer.memoryStorage();
    this.upload = multer({
      storage: storage
    });
    // Define the functionality for various HTTP the methods, of the various
    // "/user" routes:
    //routes for user auth  and crud
    this.definePath_signupUser();
    this.definePath_signup();
    this.definePath_signin();
    this.definePath_getUsers();
    this.definePath_deleteUser();
    this.definePath_updateUser();
    //routes for budgeteritems admin side
    this.definePath_getItems();
    this.definePath_createItem();
    this.definePath_updateItem();
    this.definePath_deleteItem();

    // routes for phase admin side////////////////////////////////
    this.definePath_getPhases();
    this.definePath_createPhase();
    this.definePath_deletePhase();
    this.definePath_updatePhase();

    //rpute for default phases//////////
    this.definePath_createDefaultPhase();
    this.definePath_getDefaultPhases();

    //routes for documents admin side
    // Define the functionality for various HTTP the methods, of the various document routes:
    this.definePath_addDocumentFolder();
    this.definePath_deleteDocumentFolder();
    this.definePath_updateDocumentFolder();
    this.definePath_getDocuments();
    this.definePath_addDocumentFile();
    this.definePath_deleteDocumentFile();

    //routes for budgeter admin side
    this.definePath_updateBudgeterItems();
    this.definePath_getBudgeterItems();
    // this.definePath_getChecklists();
  }

  //   //Define the path for POST Method /admin/signupuser to create new user //////
  definePath_signupUser() {
    this.router.post(
      "/signupuser",
      this.upload.single("imageurl"),
      verifyJwt,
      (request, response) => {
        if (
          !request.body.email ||
          !request.body.password ||
          !request.body.name ||
          !request.body.username
          // !request.body.imageurl
        ) {
          response
            .status(HttpStatus.BAD_REQUEST)
            .json(
              "email, username, type, name and password and imageurl attributes must be included in request body"
            );
        } else {
          // if (request.body.imageUrl !== "") {
          // console.log(request.file);
          // awsHandler
          //   .UploadToAws(request.file)
          //   .then(url => {
          adminHandler
            .createUser(
              request.body,
              request.user.userId,
              request.user.userType
              // url
            )
            .then(user => {
              response.status(HttpStatus.OK).json({ user });
            })
            .catch(Error => {
              response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
            });
          // })
          // .catch(Error => {
          //   response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          // });
          // }
        }
      }
    );
  }

  //   //Define the path for POST Method /admin/signup to create new admin //////
  definePath_signup() {
    this.router.post("/signup", (request, response) => {
      if (
        !request.body.email ||
        !request.body.password ||
        !request.body.name ||
        !request.body.username ||
        !request.body.type
      ) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            "email, username, name, type and password attributes must be included in request body"
          );
      } else {
        adminHandler
          .createAdmin(request.body)
          .then(user => {
            response.status(HttpStatus.OK).json({ user });
          })
          .catch(Error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          });
      }
    });
  }

  //   //Define the path for POST Method /admin/signin for admin signin //////
  definePath_signin() {
    this.router.post("/signin", (request, response) => {
      if (!request.body.email || !request.body.password) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            "email and password attributes must be included in request body"
          );
      } else {
        adminHandler
          .signinAdmin(request.body)
          .then(user => {
            response.status(HttpStatus.OK).json({ Token: user.token });
          })
          .catch(Error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          });
      }
    });
  }

  //   //Define the path for GET Method /admin/users to get all users //////
  definePath_getUsers() {
    this.router.get("/users", verifyJwt, (request, response) => {
      adminHandler
        .getUsers()
        .then(users => {
          response.status(HttpStatus.OK).json({ users });
        })
        .catch(Error => {
          response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
        });
    });
  }

  //   //Define the path for DELETE Method /admin/user/:id to delete user//////
  definePath_deleteUser() {
    this.router.delete("/user/:id", verifyJwt, (request, response) => {
      if (!request.params.id) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json("id of user must be included in request params");
      } else {
        adminHandler
          .deleteUser(request.params.id)
          .then(user => {
            response.status(HttpStatus.OK).json({
              message: "User Deleted Successfully"
            });
          })
          .catch(Error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          });
      }
    });
  }

  //   //Define the path for PATCH Method /admin/user/:id to update user //////
  definePath_updateUser() {
    this.router.patch("/user/:id", verifyJwt, (request, response) => {
      if (
        !request.params.id ||
        !request.body.user ||
        !request.body.user.name ||
        !request.body.user.contact ||
        !request.body.user.location ||
        !request.body.user.email ||
        !request.body.user.username ||
        !request.body.user.project
      ) {
        response.status(HttpStatus.BAD_REQUEST).json({
          Message:
            "all properties of item object must be specified in request body"
        });
      } else {
        adminHandler
          .updateUser(request.params.id, request.body.user)
          .then(newUser => {
            response.status(HttpStatus.OK).json(newUser);
          })
          .catch(Error => {
            response
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ Message: Error });
          });
      }
    });
  }

  //   //Define the path for GET Method /admin/items to get all items //////
  definePath_getItems() {
    this.router.get("/items/:phaseid", verifyJwt, (request, response) => {
      if (!request.params.phaseid) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            "userid, phaseid attributes must be included in request params"
          );
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

  //   //Define the path for POST Method /admin/items to create new item //////
  definePath_createItem() {
    this.router.post("/items", verifyJwt, (request, response) => {
      if (
        !request.body.name ||
        !request.body.phaseid ||
        !request.body.description ||
        !request.body.trade
      ) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            "name,  desc and trade of item and  phaseid attributes must be included in request body"
          );
      } else {
        itemsHandler
          .createItem(request.body)
          .then(item => {
            response.status(HttpStatus.OK).json({ item });
          })
          .catch(Error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          });
      }
    });
  }

  //   //Define the path for DELETE Method /admin/items/:id to delete item //////
  definePath_deleteItem() {
    this.router.delete("/items/:id", verifyJwt, (request, response) => {
      if (!request.params.id) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json("id of item must be included in request params");
      } else {
        itemsHandler
          .deleteItem(request.params.id)
          .then(item => {
            response.status(HttpStatus.OK).json({
              message: "Item Deleted Successfully"
            });
          })
          .catch(Error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          });
      }
    });
  }

  //   //Define the path for PATCH Method /admin/items/:id to update item //////
  definePath_updateItem() {
    this.router.patch("/items/:id", verifyJwt, (request, response) => {
      if (
        !request.body.name ||
        !request.body.description ||
        !request.body.trade
      ) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            "name,  desc, trade and estimated cost of item and userid, phaseid and itemid attributes must be included in request body"
          );
      } else {
        itemsHandler
          .updateItem(request.params.id, request.body)
          .then(newItem => {
            response.status(HttpStatus.OK).json(newItem);
          })
          .catch(Error => {
            response
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ Message: Error });
          });
      }
    });
  }

  definePath_createDefaultPhase() {
    this.router.post("/phase/default/post", verifyJwt, (request, response) => {
      if (
        !request.body.name ||
        !request.body.description ||
        !request.body.adminDefault ||
        !request.body.color
      ) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            "name, and duedate of phase,default status and color attributes must be included in request body"
          );
      } else {
        phaseHandler
          .createPhase(request.body)
          .then(phase => {
            response.status(HttpStatus.OK).json({ phase });
          })
          .catch(Error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          });
      }
    });
  }

  definePath_getDefaultPhases() {
    this.router.get("/phase/default/get", verifyJwt, (request, response) => {
      phaseHandler
        .getDefaultPhases()
        .then(phases => {
          response.status(HttpStatus.OK).json({ phases });
        })
        .catch(Error => {
          response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
        });
    });
  }

  definePath_createPhase() {
    this.router.post("/phase", verifyJwt, (request, response) => {
      if (
        !request.body.name ||
        !request.body.description ||
        !request.body.userid ||
        !request.body.color
      ) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            "name, and description of phase and userid color attributes must be included in request body"
          );
      } else {
        phaseHandler
          .createPhase(request.body)
          .then(phase => {
            response.status(HttpStatus.OK).json({ phase });
          })
          .catch(Error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          });
      }
    });
  }

  definePath_updatePhase() {
    this.router.patch("/phase/:id", verifyJwt, (request, response) => {
      if (
        !request.body.name ||
        !request.body.description ||
        !request.body.color
      ) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            "name, color, and description of phase  must be included in request body"
          );
      } else {
        phaseHandler
          .updatePhase(request.body, request.params.id)
          .then(phase => {
            response.status(HttpStatus.OK).json({ phase });
          })
          .catch(Error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          });
      }
    });
  }

  definePath_deletePhase() {
    this.router.delete("/phase/:id", verifyJwt, (request, response) => {
      if (!request.params.id) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json("id of phase attributes must be included in request params");
      } else {
        phaseHandler
          .deletePhase(request.params.id)
          .then(phase => {
            response.status(HttpStatus.OK).json("phase deleted successfully");
          })
          .catch(Error => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          });
      }
    });
  }

  definePath_getPhases() {
    this.router.get("/phase/:userid", verifyJwt, (request, response) => {
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

  //Define the path for Post Method  to add a new document folder//////
  definePath_addDocumentFolder() {
    this.router.post("/document", verifyJwt, (request, response) => {
      // console.log(request.body.checklist);
      if (!request.body.folderName || !request.body.userId) {
        response.status(HttpStatus.BAD_REQUEST).json({
          Message: "folder name and user's id Must be Defined in request body"
        });
      } else {
        documentHandler
          .addDocumentFolder(
            request.body.folderName,
            request.body.userId,
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
    this.router.delete("/document/:id", verifyJwt, (request, response) => {
      if (!request.params.id) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json("id of folder  must be included in request params ");
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
    });
  }

  //Define the path for get Method  to get a documents by userid //////
  definePath_getDocuments() {
    this.router.get("/document/:userid", verifyJwt, (request, response) => {
      if (!request.params.userid) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json("id of user must be included in request params");
      } else {
        documentHandler
          .getDocuments(request.params.userid)
          .then(documents => {
            response.status(HttpStatus.OK).json({ documents });
          })
          .catch(Error => {
            response
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ Message: Error });
          });
      }
    });
  }

  //   //Define the path for PATCH Method to update documentFolder //////
  definePath_updateDocumentFolder() {
    this.router.patch("/document/:id", verifyJwt, (request, response) => {
      if (!request.params.id || !request.body.folderName) {
        response.status(HttpStatus.BAD_REQUEST).json({
          Message: "id params and folder name must be specified in request body"
        });
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
    });
  }

  //   // //Define the path for Delete Method   to DELETE a pdf file by its id //////

  definePath_deleteDocumentFile() {
    this.router.delete(
      "/document/:docid/pdf/:id",
      verifyJwt,
      (request, response) => {
        if (!request.params.id || !request.params.docid) {
          response.status(HttpStatus.BAD_REQUEST).json({
            Message:
              "pdf's id and folder id of document  Must be Defined in request"
          });
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
    );
  }

  //Define the path for Post Method to add a new pdf file in folder//////
  definePath_addDocumentFile() {
    this.router.post(
      "/document/:docid/pdf",
      // this.upload.single("pdfurl"),
      verifyJwt,
      (request, response) => {
        if (!request.params.docid || !request.body.pdfurl) {
          response
            .status(HttpStatus.BAD_REQUEST)
            .json(
              "folder id in params, and pdf url  must be included in request body"
            );
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
          // })
          // .catch(Error => {
          //   response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
          // });
          // }
        }
      }
    );
  }

  definePath_updateBudgeterItems() {
    this.router.patch(
      "/budgeter/update/:itemid",
      verifyJwt,
      (request, response) => {
        if (
          !request.body.estimatedCost ||
          !request.body.paidCost ||
          !request.body.userid ||
          !request.params.itemid
        ) {
          response
            .status(HttpStatus.BAD_REQUEST)
            .json(
              "itemid must be included in params, estimatedCost,userid and paidCost attributes must be included in request body"
            );
        } else {
          budgeterHandler
            .updateBudgeter(request.params.itemid, request.body)
            .then(doc => {
              response.status(HttpStatus.OK).json({ doc });
            })
            .catch(Error => {
              // console.log(Error);
              response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(Error);
            });
        }
      }
    );
  }

  definePath_getBudgeterItems() {
    this.router.get("/budgeter/:userid", verifyJwt, (request, response) => {
      if (!request.params.userid) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json("userid attribute must be included in request body");
      } else {
        budgeterHandler
          .getBudgeter(request.params.userid)
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

module.exports = new Admin();
