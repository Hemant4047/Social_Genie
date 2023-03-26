const { default: axios } = require("axios");
const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook");

let router = express.Router();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/oauth/callback",
      state: true,
    },
    function verify(accessToken, refreshToken, profile, cb) {
      let user = { ...profile, accessToken: accessToken };
      return cb(null, user);
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

/* /oauth/login */
// the login button from frontend should hit this.
router.get(
  "/login",
  passport.authenticate("facebook", {
    scope: [
      "pages_manage_cta",
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_metadata",
      "pages_read_user_content",
      "pages_manage_ads",
      "pages_manage_posts",
      "pages_manage_engagement",
      "public_profile",
      "email",
    ],
  })
);

/* /oauth/callback */
router.get(
  "/callback",
  function (req, res, next) {
    console.log("facebook login success");
    next();
  },
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:5001/",
    failureRedirect: "/error",
  })
);

/* /oauth/success */
router.get("/success", function (req, res) {
  //res.redirect("/oauth/postMessage");
  res.send({ oauth: "facebook", authenticated: true, user: req.user });
});

/* /oauth/logout */
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:5001/");
  });
});

router.get("/postMessage", function (req, res, next) {
  const access_token = req.user.accessToken;
  let page_id;
  let page_access_token;
  let url = `https://graph.facebook.com/v16.0/me/accounts?access_token=${access_token}`;
  let data = {
    message: "sent from social-genie's UI!",
  };
  axios
    .get(url)
    .then((response) => {
      console.log("user's FB profile data: ", response.data.data);
      let page_list = response.data.data;
      page_id = page_list[0].id;
      page_access_token = page_list[0].access_token;
    })
    .then(() => {
      url = `https://graph.facebook.com/v16.0/${page_id}/feed?access_token=${page_access_token}`;
      // console.log(url);
      return axios.post(url, data);
    })
    .then((response) => {
      console.log("posted successfully: ", response.data);
    })
    .catch((err) => {
      console.log(Error("Axios Error"), err);
    });
  res.redirect("http://localhost:5001/content");
  // res.send({ page: "postMessage", user: req.user });
});

module.exports = router;
