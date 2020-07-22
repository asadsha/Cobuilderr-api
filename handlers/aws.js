const AWS = require("aws-sdk");
const config = require("../config/config");

UploadToAws = file => {
  let s3bucket = new AWS.S3({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    Bucket: config.AWS_BUCKET
  });

  return new Promise(function(resolve, reject) {
    s3bucket.createBucket(function() {
      var params = {
        Bucket: config.AWS_BUCKET,
        Key: file.originalname,
        Body: file.buffer,
        accessKeyId: config.AWS_ACCESS_KEY,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        ACL: "public-read"
      };
      s3bucket.upload(params, function(err, data) {
        if (err) {
          reject("Could'nt upload Files!!!!!" + err);
        } else {
          resolve(data.Location);
        }
      });
    });
  });
};

module.exports = { UploadToAws };
