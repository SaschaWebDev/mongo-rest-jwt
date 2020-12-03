const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  authorizeUser,
};

function authorizeUser(req, res, next) {
  const jwt = req.headers.authorization;

  jsonwebtoken.verify(jwt, process.env.JWT_SECRET, (error, decodedToken) => {
    error
      ? res.status(401).json({ message: "Autorisierung User fehlgeschlagen." })
      : ((req.decodedToken = decodedToken), next());
  });
}
