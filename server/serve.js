const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const logger = require("morgan");
const helmet = require("helmet");
var session = require("express-session");
const swaggerUi = require("swagger-ui-express");
const admin_swaggerDocument = require("./swagger/admin-swagger.json");

const app = express();

const flash = require("connect-flash");
app.use(helmet());
app.use(cors());
app.use(flash());

const corsOptions = "*";
const CorsOp = null;

app.use(function (req, res, next) {
  let ORIGIN = req.headers.origin;
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors({ corsOptions }));

app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "woot",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/admin-swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(admin_swaggerDocument);
});

app.use(
  "/api-doc/admin",
  swaggerUi.serve,
  swaggerUi.setup(admin_swaggerDocument)
);

app.use(cors(corsOptions));

const dbConfig = require("./app/config/db.config");
const db = require("./app/models");

db.mongoose
  .connect(
    `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      returnNewDocument: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.use(bodyParser.json({ limit: "500000mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "500000mb",
    extended: true,
    parameterLimit: 500000,
    bodylimit: 500000,
  })
);

app.use(logger("dev"));
require("dotenv").config();

// set port, listen for requests
require("./app/middleware/admin.passport");
app.use(passport.initialize());

require("./app/routes/admin.route")(app);

const PORT = process.env.PORT || 5989;
app.listen(PORT, "0.0.0.0", () => {
  // app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
