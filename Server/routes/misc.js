const express = require("express");
const { default: axios } = require("axios");
const FormData = require("form-data");
const fs = require("fs");

let router = express.Router();

router.get("/", function (req, res, next) {
  console.log("inside the misc fields");
  res.end();
});

router.get("/a", function (req, res, next) {
  console.log("Inside postImage");
  const formData = new FormData();
  formData.append("key", "64cca6a2e65f2815a09697176422153b");
  formData.append("sample.jpg", fs.createReadStream("./sample.jpg"));

  axios
    .post("https://api.imgbb.com/1/upload", formData, {
      headers: formData.getHeaders(),
    })
    .then((response) => {
      console.log("success");
      console.log(response);
    })
    .catch((err) => {
      console.log("error");
      console.log(err);
    });

  res.send({ res: "end" });
});

module.exports = router;
