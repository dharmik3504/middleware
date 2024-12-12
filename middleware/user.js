const jwt = require("jsonwebtoken");
const JWT_USER_PASSWORD = "yoyoyoysjsjsjsjosjsjsjsj";
function userAuth(req, res, next) {
  const { token } = req.headers;
  const verifiedToken = jwt.verify(token, JWT_USER_PASSWORD);
  if (verifiedToken) {
    req.userId = verifiedToken.id;
    next();
  } else {
    res.json("user is not valid please sign again");
  }
}

module.exports = {
  userAuth,
  JWT_USER_PASSWORD,
};
