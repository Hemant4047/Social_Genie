const fs = require("fs");
const express = require("express");
const linkedin_session = require("express-session");
const passport = require("passport");
let LinkedinStrategy = require("passport-linkedin-oauth2").Strategy;
var SQLiteStore = require("connect-sqlite3")(linkedin_session);
const { default: axios, HttpStatusCode } = require("axios");
const schedule = require("node-schedule");
const FormData = require("form-data");
const { getFormData } = require("../models/formData");

let router = express.Router();
let linkedin_passport = new passport.Passport();

router.use(
  linkedin_session({
    name: "connect.lin.sid",
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions_lin.db", dir: "./var/db" }),
  })
);
router.use(linkedin_passport.authenticate("session"));

linkedin_passport.use(
  new LinkedinStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/oauth/linkedin/callback",
      scope: ["r_emailaddress", "r_liteprofile", "w_member_social"],
      state: true,
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        let user = { ...profile, accessToken };
        return done(null, user);
      });
    }
  )
);

linkedin_passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  });
});

linkedin_passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

/* /oauth/linkedin/login */
router.get("/login", linkedin_passport.authenticate("linkedin"));

/* /oauth/linkedin/callback */
router.get(
  "/callback",
  function (req, res, next) {
    console.log("/oauth/linkedin/callback ", "LOGIN SUCCESS");
    next();
  },
  linkedin_passport.authenticate("linkedin", {
    successRedirect: "http://localhost:5001",
    failureRedirect: "/error",
  })
);

/* /oauth/linkedin/success */
router.get("/success", function (req, res, next) {
  if (!req.user) {
    return res.send({ oauth: "linkedin", authenticated: false });
  }
  res.send({ oauth: "linkedin", user: req.user });
});

/* /oauth/linkedin/logout */
router.get("/logout", function (req, res, next) {
  console.log("GET /oauth/linkedin/logout");
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:5001");
  });
});

/* /oauth/linkedin/user */
router.get("/user", function (req, res, next) {
  console.log(
    "GET /oauth/linkedin/user req.user exists",
    req.user != undefined
  );
  if (req.user) {
    return res.status(201).json({ user: req.user });
  } else res.json({ user: null });
});

const postMessage = function (req, res, next) {
  const accessToken = req.user.accessToken;
  let linkedin_id = null;
  let url = `https://api.linkedin.com/v2/me?oauth2_access_token=${accessToken}`;
  axios
    .get(url)
    .then((response) => {
      linkedin_id = response.data.id;
      // console.log("id response: ", linkedin_id);
    })
    .then(() => {
      url = `https://api.linkedin.com/v2/ugcPosts?oauth2_access_token=${accessToken}`;
      let data = {
        author: `urn:li:person:${linkedin_id}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: getFormData().caption,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };
      return axios.post(url, data);
    })
    .then((response) => {
      console.log("Linkedin POST Uploaded: ", response.data);
    })
    .catch((err) => {
      console.error("LINKEDIN POST MESSAGE ERROR", err);
    });
};

/* Only for text posts */
/* /oauth/linkedin/postMessage */
router.get("/postMessage", function (req, res, next) {
  console.log("GET /oauth/linkedin/postMessage");
  postMessage(req, res, next);
  res.send("fin");
});

/* /oauth/linkedin/scheduleMessage */
router.get("/scheduleMessage", function (req, res, next) {
  console.log(
    "GET /oauth/linkedin/scheduleMessage user exists: ",
    req.user !== undefined
  );
  schedule.scheduleJob(getFormData().publishDate, () => {
    console.log(
      "posting to linkedin message only Now",
      new Date().toLocaleString()
    );
    postMessage(req, res, next);
  });
  res.send("fin");
});

const post = function (req, res, next) {
  const accessToken = req.user.accessToken;
  let linkedin_id = null;
  let data = null;
  let upload_url = null;
  let asset = null;
  let url = `https://api.linkedin.com/v2/me?oauth2_access_token=${accessToken}`;
  axios
    .get(url)
    .then((response) => {
      linkedin_id = response.data.id;
      // console.log("id response: ", linkedin_id);
    })
    .then(() => {
      url = `https://api.linkedin.com/v2/assets?action=registerUpload&oauth2_access_token=${accessToken}`;
      data = {
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          owner: `urn:li:person:${linkedin_id}`,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      };
      return axios.post(url, data);
    })
    .then((response) => {
      asset = response.data.value.asset;
      upload_url =
        response.data.value.uploadMechanism[
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ].uploadUrl;
      // console.log("Step 1 response");
      // console.log("asset", asset);
      // console.log("upload url : ", upload_url);
    })
    .then(() => {
      return axios.postForm(
        upload_url + `&oauth2_access_token=${accessToken}`,
        {
          file: fs.createReadStream("./uploads/sample.jpg"),
        },
        {
          headers: {
            "X-Restli-Protocol-Version": "2.0.0",
          },
        }
      );
    })
    .then((response) => {
      // console.log("Step 2 response");
      // console.log(response.statusText);
    })
    .then(() => {
      url = `https://api.linkedin.com/v2/ugcPosts?oauth2_access_token=${accessToken}`;
      data = {
        author: `urn:li:person:${linkedin_id}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: getFormData().caption,
            },
            shareMediaCategory: "IMAGE",
            media: [
              {
                status: "READY",
                media: asset,
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };
      return axios.post(url, data, {
        headers: {
          "X-Restli-Protocol-Version": "2.0.0",
        },
      });
    })
    .then((response) => {
      console.log("Posted on Linkedin", response.data);
    })
    .catch((err) => {
      console.error("linkedin POST error");
      console.log(err);
    });
};

/* for both text and image */
/* /oauth/linkedin/postLinkedin */
router.get("/postLinkedin", function (req, res, next) {
  console.log("GET /oauth/linkedin/postLinkedin");
  post(req, res, next);
  res.send("FIN");
});

/* /oauth/linkedin/schedulePost */
router.get("/schedulePost", function (req, res, next) {
  console.log(
    "GET /oauth/linkedin/schedulePost user exists: ",
    req.user !== undefined
  );
  schedule.scheduleJob(getFormData().publishDate, () => {
    console.log("posting to linkedin Now", new Date().toLocaleString());
    post(req, res, next);
  });
  res.send("fin");
});

module.exports = router;
