const model = require("../models/Model");
const userHandler = require("../handlers/user");

getUserConversation = userId => {
  return new Promise((resolve, reject) => {
    model.messageModel
      .find({
        "sender.id": userId,
        "receiver.id": userId
      })
      .sort({ createdAt: -1 })
      .exec((err, messages) => {
        if (err) {
          reject("Can Not Get Conversation. " + err.message);
        } else {
          if (messages.length === 0) {
            resolve("No messages.");
          } else {
            resolve(messages);
          }
        }
      });
  });
};

getAdminConversation = adminId => {
  return new Promise((resolve, reject) => {
    model.messageModel
      .find({
        "sender.idd": adminId,
        "receiver.idd": adminId
      })
      .sort({ createdAt: -1 })
      .exec((err, messages) => {
        if (err) {
          reject("Can Not Get Conversation. " + err.message);
        } else {
          if (messages.length === 0) {
            resolve("No messages.");
          } else {
            resolve(messages);
          }
        }
      });
  });
};

createMessage = params => {
  return new Promise((resolve, reject) => {
    // console.log(params);
    let messageDoc = model.messageModel({
      text: params.text,
      sender: params.sender,
      receiver: params.receiver
    });
    messageDoc.save((err, msg) => {
      if (err) {
        console.log("nside reject of message.save");
        reject(err);
      } else {
        resolve(msg);
      }
    });
  });
};

deleteMessage = id => {
  return new Promise((resolve, reject) => {
    model.messageModel.findByIdAndRemove(id, (err, msg) => {
      if (err) {
        reject("Can Not Delete Message from db. " + err.message);
      } else {
        if (msg == null) {
          reject("This message Does not Exist");
        } else {
          resolve(msg);
        }
      }
    });
  });
};

module.exports = { getUserConversation, createMessage, deleteMessage };
