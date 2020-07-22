const uniqueEmail = (currentUser, dbUser) => {
  if (currentUser.email === dbUser.email) {
    return "Email Already Exists";
  } else if (currentUser.username === dbUser.username) {
    return "username already exists";
  }
};

//it will return true for string and false for any non string value
var isRealString = str => {
  return typeof str === "string" && str.trim().length > 0;
};

module.exports = {
  uniqueEmail,
  isRealString
};
