const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
// for development
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});
// for production
//db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "My local server is running!" });
});

require("./app/routes/book.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
