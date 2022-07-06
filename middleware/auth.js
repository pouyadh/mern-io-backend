const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const httpOnlyToken = req.cookies.token;
    const normalToken = req.cookies.auth;
    const [tokenType, token] = httpOnlyToken.split(" ");
    if (
      !normalToken ||
      httpOnlyToken !== normalToken ||
      !token ||
      tokenType !== "Bearer"
    ) {
      return res.status(403).json({ msg: "Not Authorized" });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(403).json({ msg: "Invalid Token" });
  }
  return next();
};

module.exports = verifyToken;
