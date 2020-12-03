const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  authorizeAdmin,
};

function authorizeAdmin(req, res, next) {
  const jwt = req.headers.authorization;

  jsonwebtoken.verify(jwt, process.env.JWT_SECRET, (error, decodedToken) => {
    if (error) {
      res.status(401).json({ message: "Autorisierung User fehlgeschlagen." });
    } else {
      decodedToken.role === "administrator"
        ? next()
        : res
            .status(401)
            .json({ message: "Autorisierung Admin fehlgeschlagen." });
    }
  });
}
