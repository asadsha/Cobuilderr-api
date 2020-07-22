const jwt = require("jsonwebtoken");

const config = require("../config/config");

const HttpStatus = require("http-status-codes");

verifyUser = (req, res, next) => {
  if (req.headers["authorization"] != undefined) {
    req.body.token = req.headers["authorization"].split(" ")[1];

    if (!req.body.token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Cannot Authorize, No Token Provided in request headers"
      });
    } else {
      jwt.verify(req.body.token, config.JwtSecret, function(err, decoded) {
        if (err) {
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ message: "Unauthorized token"});
        } else {
          req.user = decoded;
          next();
        }
      });
    }
  } else {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "No Authorization Headers Provided!!!" });
  }
};

module.exports = {
  verifyUser
};
