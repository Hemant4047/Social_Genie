/*
social genie's
FACEBOOK_CLIENT_ID = "628371911974676"
FACEBOOK_CLIENT_SECRET = "377068159ff02d9be1df0b082b1163ed"
*/
const { default: axios, HttpStatusCode } = require("axios");
const express = require("express");
const fb_session = require("express-session");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
var SQLiteStore = require("connect-sqlite3")(fb_session);
let imgbbUploader = require("imgbb-uploader");
const { getFormData, getNewPhotoUploaded } = require("../../models/formData");

let router = express.Router();
let fb_passport = new passport.Passport();

router.use(
  fb_session({
    name: "connect.fb.sid",
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions_fb.db", dir: "./var/db" }),
  })
);
router.use(fb_passport.authenticate("session"));

fb_passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/oauth/facebook/callback",
      state: true,
    },
    function verify(accessToken, refreshToken, profile, cb) {
      let user = { ...profile, accessToken: accessToken };
      return cb(null, user);
    }
  )
);

fb_passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  });
});

fb_passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

/* /oauth/facebook/login */
// the login button from frontend should hit this.
router.get(
  "/login",
  fb_passport.authenticate("facebook", {
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
      "ads_management",
      "business_management",
      "instagram_basic",
      "instagram_content_publish",
    ],
  })
);

/* /oauth/facebook/callback */
router.get(
  "/callback",
  function (req, res, next) {
    console.log("/oauth/facebook/callback ", "LOGIN SUCCESS");
    next();
  },
  fb_passport.authenticate("facebook", {
    successRedirect: "http://localhost:5001/",
    failureRedirect: "/error",
  })
);

/* /oauth/facebook/user */
router.get("/user", async function (req, res, next) {
  console.log(
    "GET /oauth/facebook/user req.user exists",
    req.user != undefined
  );
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

/* /oauth/facebook/success */
router.get("/success", function (req, res) {
  if (req.user)
    res.send({ oauth: "facebook", authenticated: true, user: req.user });
  else res.send({ oauth: "facebook", authenticated: false });
});

/* /oauth/facebook/logout */
router.get("/logout", function (req, res, next) {
  console.log("GET /oauth/facebook/logout");
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:5001/");
  });
});

/* Post Only text on Facebook */
/* /oauth/facebook/postFbMessageOnly */
router.get("/postFbMessageOnly", function (req, res, next) {
  console.log("GET /oauth/facebook/postFbMessageOnly ");
  const access_token = req.user.accessToken;
  let page_id;
  let page_access_token;
  let url = `https://graph.facebook.com/v16.0/me/accounts?access_token=${access_token}`;
  let data = {
    message: getFormData().caption,
  };
  console.log("GET /oauth/facebook/postFbMessageOnly data: ", data);
  axios
    .get(url)
    .then((response) => {
      // console.log("user's FB profile data: ", response.data.data);
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
      console.log("posted successfully to facebook: ", response.data);
    })
    .catch((err) => {
      console.log(Error("Axios Error"), err);
    });
  res.redirect("http://localhost:5001/content");
  // res.send({ page: "postMessage", user: req.user });
});

/* Post Photo and Caption on Facebook */
/* /oauth/facebook/postFb */
router.get("/postFb", function (req, res, next) {
  console.log("GET /oauth/facebook/postFb");

  if (getNewPhotoUploaded() == false) {
    console.log("GET /oauth/facebook/postFb NO PHOTO TO UPLOAD");
    res
      .status(HttpStatusCode.BadRequest)
      .send({ data: "upload photo to use this endpoint" });
  }

  const accessToken = req.user.accessToken;
  console.log("req.user exists", req.user != undefined);
  let page_id;
  let page_access_token;
  let url = `https://graph.facebook.com/v16.0/me/accounts?access_token=${accessToken}`;
  let data;

  console.log("GET graph.facebook.com/me/accounts");
  axios
    .get(url)
    .then((response) => {
      // console.log("user's FB profile data: ", response.data.data);
      let page_list = response.data.data;
      page_id = page_list[0].id;
      page_access_token = page_list[0].access_token;
    })
    .then(() => {
      console.log("uploading image to IMGBB");
      return imgbbUploader(process.env.IMGBB_SECRET, "./uploads/sample.jpg");
    })
    .then((response) => {
      console.log("Image uploaded", response.image.url);
      data = {
        url: response.image.url,
        message: getFormData().caption,
      };
      console.log("data sent: ", data);
    })
    .then(() => {
      console.log("POST to Facebook");
      url = `https://graph.facebook.com/v16.0/${page_id}/photos?access_token=${page_access_token}`;
      return axios.post(url, data);
    })
    .then((response) => {
      console.log("Posted on Facebook, response: ", response.data);
    })
    .catch((err) => {
      console.log("Facebook post error", err);
    });
  res.send("Facebook post done");
});

/* /oauth/facebook/fetchAllFb */
router.get("/fetchAllFb", function (req, res, next) {
  console.log("GET /oauth/facebook/fetchAllFb");
  const access_token = req.user.accessToken;
  let page_id;
  let page_access_token;
  let url = `https://graph.facebook.com/v16.0/me/accounts?access_token=${access_token}`;
  let feed;
  axios
    .get(url)
    .then((response) => {
      // console.log("user's FB profile data: ", response.data.data);
      let page_list = response.data.data;
      page_id = page_list[0].id;
      page_access_token = page_list[0].access_token;
    })
    .then(() => {
      url = `https://graph.facebook.com/v16.0/${page_id}/feed?fields=full_picture,message,permalink_url,likes,comments,shares&access_token=${page_access_token}`;
      return axios.get(url);
    })
    .then((response) => {
      feed = response.data;
      console.log("GET /oauth/facebook/fetchAllFb Data Found");
      res.send(feed);
    })
    .catch((err) => {
      console.log("FETCHALLFB ERROR", err);
      res
        .status(HttpStatusCode.InternalServerError)
        .send({ "something bad happened": "in server" });
    });
});

/* Post photo with caption to IG */
router.get("/postIg", function (req, res, next) {
  console.log("GET /oauth/facebook/postIg");

  if (getNewPhotoUploaded() == false) {
    console.log("GET /oauth/facebook/postIg NO PHOTO TO UPLOAD");
    res
      .status(HttpStatusCode.BadRequest)
      .send({ data: "upload photo to use this endpoint" });
  }

  const accessToken = req.user.accessToken;
  let page_id, ig_user_id, img_url;
  let container_id;
  let url = `https://graph.facebook.com/v16.0/me/accounts?access_token=${accessToken}`;
  axios
    .get(url)
    .then((response) => {
      // console.log("user's pages", response.data.data);
      let page_list = response.data.data;
      page_id = page_list[0].id;
    })
    .then(() => {
      url = `https://graph.facebook.com/v16.0/${page_id}?fields=instagram_business_account&access_token=${accessToken}`;
      return axios.get(url);
    })
    .then((response) => {
      console.log("IG user id: ", response.data.instagram_business_account.id);
      ig_user_id = response.data.instagram_business_account.id;
    })
    .then(() => {
      console.log("Uploading image to IMGBB");
      return imgbbUploader(process.env.IMGBB_SECRET, "./uploads/sample.jpg");
    })
    .then((response) => {
      console.log("image uploaded", response.image.url);
      img_url = response.image.url;
    })
    .then(() => {
      console.log("Creating a IG container");
      url = `https://graph.facebook.com/v16.0/${ig_user_id}/media?access_token=${accessToken}`;
      data = {
        image_url: img_url,
        caption: getFormData().caption,
      };
      return axios.post(url, data);
    })
    .then((response) => {
      console.log("container: ", response.data);
      container_id = response.data.id;
    })
    .then(() => {
      console.log("Publishing the IG container");
      url = `https://graph.facebook.com/v16.0/${ig_user_id}/media_publish?access_token=${accessToken}`;
      data = {
        creation_id: container_id,
      };
      return axios.post(url, data);
    })
    .then((response) => {
      console.log("Published on Instagram", response.data);
    })
    .catch((err) => {
      console.log(Error("IG error"), err);
    });
  res.send("success");
});

/* /oauth/facebook/fecthAllIg */
router.get("/fetchAllIg", function (req, res, next) {
  console.log("GET /oauth/facebook/fetchAllIg");
  const accessToken = req.user.accessToken;
  let page_id, ig_user_id;
  let url = `https://graph.facebook.com/v16.0/me/accounts?access_token=${accessToken}`;
  axios
    .get(url)
    .then((response) => {
      // console.log("user's pages", response.data.data);
      let page_list = response.data.data;
      page_id = page_list[0].id;
    })
    .then(() => {
      url = `https://graph.facebook.com/v16.0/${page_id}?fields=instagram_business_account&access_token=${accessToken}`;
      return axios.get(url);
    })
    .then((response) => {
      console.log("IG user id: ", response.data.instagram_business_account.id);
      ig_user_id = response.data.instagram_business_account.id;
    })
    .then(() => {
      url = `https://graph.facebook.com/v16.0/${ig_user_id}/media?fields=permalink,media_url,caption,like_count,comments_count,comments&access_token=${accessToken}`;
      return axios.get(url);
    })
    .then((response) => {
      const feed = response.data;
      console.log("GET /oauth/facebook/fetchAllIg Data Found");
      res.send(feed);
    })
    .catch((err) => {
      console.log("FETCHALLIG ERROR", err);
      res
        .status(HttpStatusCode.InternalServerError)
        .send({ "Something bad happened": "at server" });
    });
});

module.exports = router;
