// We are using Login-test facebook app.
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const createError = require("http-errors");
let { setFormCaption, setNewPhoto, setFormDate } = require("./models/formData");

const fb_routeHandler = require("./routes/facebook/oauth_fb");
const linkedin_routeHandler = require("./routes/oauth_linkedin");
const twitter_routeHandler = require("./routes/oauth_twitter");

const upload = multer({ dest: "uploads/" });
const app = express();

// should be un-commented when frontend is making requests
app.use(cors({ origin: "http://localhost:5001", credentials: true }));

// Old JSON parsing middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // To parse incoming form data

// OAuth routes
app.use("/oauth/facebook", fb_routeHandler);

app.use("/oauth/linkedin", linkedin_routeHandler);

app.use("/oauth/twitter", twitter_routeHandler);

// Upload the form data here and then call fb and ig upload separately.
app.post("/upload", upload.single("photo"), function (req, res, next) {
  console.log("POST /upload");

  if (req.file !== undefined) {
    console.log("POST /upload Successfully saved the photo");
    try {
      fs.renameSync(
        path.join(__dirname, "uploads", req.file.filename),
        path.join(__dirname, "uploads", "sample.jpg")
      );
      setNewPhoto(true);
    } catch (err) {
      console.log("Upload File Rename Error", err);
      res.send({ success: false });
    }
  } else {
    console.log("POST /upload No File uploaded");
    setNewPhoto(false);
  }

  let date = req.body["schedule-date"];
  let time = req.body["schedule-time"];

  if (date != "" && time != "") {
    let splitDate = date.split("-");
    let splitTime = time.split(":");
    splitDate[1] = (Number(splitDate[1]) - 1).toString();
    const publishDate = new Date(
      splitDate[0],
      splitDate[1],
      splitDate[2],
      splitTime[0],
      splitTime[1]
    );
    setFormDate(publishDate);
    console.log("POST /upload scheduled date", publishDate.toLocaleString());
  } else {
    console.log("POST /upload NOT scheduled");
    setFormDate(null);
  }
  console.log("POST /upload Form data: ", req.body);
  setFormCaption(req.body.caption);
  res.send({ success: true });
});

app.get("/", function (req, res) {
  res.send({
    "server up and running":
      "check respective oauth paths for success messages",
  });
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
app.listen(PORT, () => console.log(`🚀 Server up at PORT ${PORT}`));
