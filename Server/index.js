const express = require("express");
const cors = require("cors");
const createError = require("http-errors");

const rateLimiter = require("./middleware/rateLimiter");

require("dotenv").config();
// require("./db/config");

const session = require("express-session");
const passport = require("passport");
var SQLiteStore = require("connect-sqlite3")(session);

const authRoute = require("./routes/auth");
const oauthRouteHandler = require("./routes/facebook/oauth_fb");
const { default: axios } = require("axios");

const app = express();
app.use(cors({ origin: "http://localhost:5001", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse incoming form data
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
  })
);
app.use(passport.authenticate("session"));

// app.use(rateLimiter);

// Setting end points for api
// app.use("/auth", authRoute);

// OAuth routes
app.use("/oauth", oauthRouteHandler);

app.get("/login/success", async function (req, res) {
  console.log("/login/success", req.user);
  if (req.user) {
    let user_email;
    await axios
      .get(
        `https://graph.facebook.com/v16.0/me?fields=email&access_token=${req.user.accessToken}`
      )
      .then((response) => {
        user_email = response.data.email;
      });
    let userObj = { ...req.user, email: user_email };
    return res.status(201).json({ user: userObj });
  }
  res.json({ user: null });
});

app.get("/", function (req, res) {
  if (req.user) res.send({ user: "logged in" });
  else res.send({ hello: "world" });
});

// Check if route not present
app.use((req, res, next) => {
  next(createError.NotFound());
});

// Every error will be redirected here
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server up at PORT`, PORT));
