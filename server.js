const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const usersService = require("./services/users.js");

const server = express();

// MongoDB Verbindungsaufbau
mongoose.connect(
  `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PW}@${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Verbindungsproblem: "));
db.once("open", async () => {
  // Erstelle einen Standard-Administrator, sofern bei Server-Start keine Nutzer in der Datenbank vorhanden sind
  const users = await usersService.findAll();
  if (users.length == 0) {
    const defaultAdmin = await usersService.create(
      {
        lastname: "Sebastian",
        firstname: "Meier",
        email: "sebastian.meier@gmail.com",
        password: process.env.DEFAULT_ADMIN_PW,
      },
      "administrator"
    );
    console.log(
      "Es konnte kein Nutzer in der Datenbank gefunden werden, es wurde folgender Standard-Administrator angelegt: ",
      defaultAdmin
    );
  }
  console.log(`Verbindung zu MongoDB ${process.env.DB_NAME} erfolgreich!`);
});

server.use(express.json());
server.use(morgan("dev"));
server.use(helmet());
server.use(cors());

server.get("/", function welcome(req, res) {
  res.send(
    `Willkommen zur ${process.env.ENVIRONMENT} API von Mongo Rest JWT Template-Projekt!`
  );
});

const usersRouter = require("./routes/users.js");
server.use("/v1/users", usersRouter);

const postsRouter = require("./routes/posts.js");
server.use("/v1/posts", postsRouter);

module.exports = server;
