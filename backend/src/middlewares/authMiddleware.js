const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token, access denied!" });
  }

  try {
    const bearer = token.split(" ")[1];
    const decoded = jwt.verify(bearer, "FCODE_SECRET_KEY_123");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token!" });
  }
};

module.exports = verifyToken;
