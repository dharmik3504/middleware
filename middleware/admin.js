const jwt = require("jsonwebtoken");
const JWT_ADMIN_PASSWORD = "yoyoyoyosjsjsjsj";
function adminAuth(req, res, next) {
  const { token } = req.headers;
  console.log(token);
  const verifiedToken = jwt.verify(token, JWT_ADMIN_PASSWORD);
  if (verifiedToken) {
    req.userId = verifiedToken.id;
    next();
  } else {
    res.json("user is not valid please sign again");
  }
}

module.exports = {
  adminAuth,
  JWT_ADMIN_PASSWORD,
};
