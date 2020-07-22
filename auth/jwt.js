const jwt = require("jsonwebtoken");

const config = require("../config/config");

exports.generateJwt = payloadObj => {
  return new Promise((resolve, reject) => {
    if (payloadObj) {
      const token = jwt.sign(payloadObj, config.JwtSecret, {
        expiresIn: 86400 * 60
      });
      resolve(token);
    } else {
      reject(err);
    }
  });
};
