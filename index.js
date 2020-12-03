require("dotenv").config();

const server = require("./server.js");

const host = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(
    `\n Server gestartet und erreichbar unter http://${host}:${port}  \n`
  );
});
