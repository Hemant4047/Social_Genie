const express = require("express");
const twitter_session = require("express-session");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
var SQLiteStore = require("connect-sqlite3")(twitter_session);
const { default: axios } = require("axios");
const fs = require("fs");
const crypto = require("crypto");
const OAuth = require("oauth-1.0a");
const schedule = require("node-schedule");
const { getFormData } = require("../models/formData");

let router = express.Router();
let twitter_passport = new passport.Passport();
const oauth = OAuth({
  consumer: {
    key: process.env.TWITTER_CLIENT_ID,
    secret: process.env.TWITTER_CLIENT_SECRET,
  },
  signature_method: "HMAC-SHA1",
  hash_function: (baseString, key) =>
    crypto.createHmac("sha1", key).update(baseString).digest("base64"),
});

router.use(
  twitter_session({
    name: "connect.twitter.sid",
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions_twitter.db", dir: "./var/db" }),
  })
);
router.use(twitter_passport.authenticate("session"));

twitter_passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CLIENT_ID,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/oauth/twitter/callback",
      state: true,
    },
    function (accessToken, accessTokenSecret, profile, done) {
      process.nextTick(function () {
        let user = { ...profile, accessToken, accessTokenSecret };
        return done(null, user);
      });
    }
  )
);

twitter_passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  });
});

twitter_passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

/* /oauth/twitter/login */
router.get("/login", twitter_passport.authenticate("twitter"));

/* /oauth/twitter/callback */
router.get(
  "/callback",
  function (req, res, next) {
    console.log("/oauth/twitter/callback ", "LOGIN SUCCESS");
    next();
  },
  twitter_passport.authenticate("twitter", {
    successRedirect: "http://localhost:5001",
    failureRedirect: "/error",
  })
);

/* /oauth/twitter/success */
router.get("/success", function (req, res, next) {
  if (!req.user) {
    return res.send({ oauth: "twitter", authenticated: false });
  }
  res.send({ oauth: "twitter", user: req.user });
});

/* /oauth/twitter/logout */
router.get("/logout", function (req, res, next) {
  console.log("GET /oauth/twitter/logout");
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:5001");
  });
});

/* /oauth/twitter/user */
router.get("/user", function (req, res, next) {
  console.log("GET /oauth/twitter/user req.user exists", req.user != undefined);
  if (req.user) {
    return res.status(201).json({ user: req.user });
  } else res.json({ user: null });
});

const postMessage = function (req, res, next) {
  const accessToken = req.user.accessToken;
  const accessTokenSecret = req.user.accessTokenSecret;
  //   console.log("access token: ", accessToken);
  //   console.log("access token secret: ", accessTokenSecret);

  const data = {
    text: getFormData().caption,
  };

  let url = "https://api.twitter.com/2/tweets";

  const token = {
    key: accessToken,
    secret: accessTokenSecret,
  };

  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url: url,
        method: "POST",
      },
      token
    )
  );

  // console.log("AUTH HEADER created");
  // console.log(authHeader);

  axios
    .post(url, data, {
      headers: {
        Authorization: authHeader.Authorization,
      },
    })
    .then((response) => {
      console.log("Posted successfully on twitter: ", response.data);
    })
    .catch((err) => {
      console.error("ERROR", err);
    });

  // older media upload endpoint -- Now Throws not supported Error.
  // axios
  //   .postForm(
  //     "https://api.twitter.com/2/media",
  //     {
  //       media: fs.createReadStream("./uploads/sample.jpg"),
  //     },
  //     {
  //       headers: {
  //         Authorization: authHeader.Authorization,
  //       },
  //     }
  //   )
  //   .then((response) => {
  //     console.log("RESPONSE");
  //     console.log(response.data);
  //   })
  //   .catch((err) => {
  //     console.error("ERROR", err);
  //   });
};

/* Only for text messages */
/* /oauth/twitter/postMessage */
router.get("/postMessage", function (req, res, next) {
  console.log("GET /oauth/twitter/postMessage");
  postMessage(req, res, next);
  res.send("FIN");
});

/* /oauth/twitter/scheduleMessage */
router.get("/scheduleMessage", function (req, res, next) {
  console.log("GET /oauth/twitter/scheduleMessage");
  schedule.scheduleJob(getFormData().publishDate, () => {
    console.log("posting to Twitter Now", new Date().toLocaleString());
    postMessage(req, res, next);
  });
  res.send("FIN");
});

module.exports = router;
