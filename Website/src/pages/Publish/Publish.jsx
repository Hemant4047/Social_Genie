import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Publish.css";
import { useForm } from "react-hook-form";
import { UserContext } from "../../App";
import axios from "axios";

const serverUrl = "http://localhost:5000";

const postFacebook = function () {
  return axios.get(serverUrl + "/oauth/facebook/postFb", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
    withCredentials: true,
  });
};

const scheduleFb = function () {
  return axios.get(serverUrl + "/oauth/facebook/scheduleFb", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
    withCredentials: true,
  });
};

const postFacebookMessageOnly = function () {
  return axios.get(serverUrl + "/oauth/facebook/postFbMessageOnly", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
    withCredentials: true,
  });
};

const scheduleFbMessageOnly = function () {
  return axios.get(serverUrl + "/oauth/facebook/scheduleFbMessage", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
    withCredentials: true,
  });
};

const postInstagram = function () {
  return axios.get(serverUrl + "/oauth/facebook/postIg", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
    withCredentials: true,
  });
};

const scheduleInstagram = function () {
  return axios.get(serverUrl + "/oauth/facebook/scheduleIg", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
    withCredentials: true,
  });
};

const postLinkedin = function () {
  return axios.get(serverUrl + "/oauth/linkedin/postLinkedin", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
    withCredentials: true,
  });
};

const scheduleLinkedin = function () {
  return axios.get(serverUrl + "/oauth/linkedin/schedulePost", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
    withCredentials: true,
  });
};

const postLinkedinMessageOnly = function () {
  return axios.get(serverUrl + "/oauth/linkedin/postMessage", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
    withCredentials: true,
  });
};

const scheduleLinkedinMessageOnly = function () {
  return axios.get(serverUrl + "/oauth/linkedin/scheduleMessage", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
    withCredentials: true,
  });
};

const postTwitter = function () {
  return axios.get(serverUrl + "/oauth/twitter/postMessage", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
    withCredentials: true,
  });
};

const scheduleTwitter = function () {
  return axios.get(serverUrl + "/oauth/twitter/scheduleMessage", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
    withCredentials: true,
  });
};

function Publish() {
  const navigate = useNavigate();
  let user = useContext(UserContext);
  let [fileSelected, setFileSelected] = useState(false);
  let [isScheduledSelected, setisScheduledSelected] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  const clearFileSelect = function () {
    console.log("clearing select");
    let photo_file = document.getElementById("file-select");
    photo_file.value = photo_file.defaultValue;
    setValue("photo", photo_file.files);
    if (fileSelected) setFileSelected(false);
  };

  const decideSetFileSelected = function (e) {
    if (e.target.files.length > 0) setFileSelected(true);
    else setFileSelected(false);
  };

  const toggleTimePicker = function () {
    let date = document.getElementById("schedule-date");
    let time = document.getElementById("schedule_time");
    date.value = date.defaultValue;
    time.value = time.defaultValue;
    setValue("schedule-date", date.value);
    setValue("schedule_time", time.value);
    // console.log("date: ", date.value, date.valueAsDate);
    // console.log("time: ", time.value, time.valueAsDate);
    setisScheduledSelected(!isScheduledSelected);
  };

  const onSubmit = function (data) {
    console.log("SUBMIT EVENT");
    const isScheduled =
      data["schedule-date"] != "" && data["schedule_time"] != "";
    const formData = new FormData();
    formData.append("photo", data.photo[0]);
    formData.append("caption", data.caption);
    formData.append("schedule-date", data["schedule-date"]);
    formData.append("schedule-time", data["schedule_time"]);
    // console.log("photo: ", data.photo);
    // console.log("date: ", data["schedule-date"]);
    // console.log("time: ", data["schedule_time"]);
    // console.log("isScheduled: ", isScheduled);

    axios
      .post(serverUrl + "/upload", formData)
      .then((response) => {
        console.log("response", response.data);
        navigate("/home");
        if (response.data.success === true) {
          if (isScheduled) {
            if (data.igSelected) scheduleInstagram();
            if (data.fbSelected) {
              if (data.photo.length === 0) scheduleFbMessageOnly();
              else scheduleFb();
            }
            if (data.linkedinSelected) {
              if (data.photo.length > 0) scheduleLinkedin();
              else scheduleLinkedinMessageOnly();
            }
            if (data.twitterSelected) scheduleTwitter();
          } else {
            if (data.igSelected) postInstagram();
            if (data.fbSelected) {
              if (data.photo.length === 0) postFacebookMessageOnly();
              else postFacebook();
            }
            if (data.linkedinSelected) {
              if (data.photo.length > 0) postLinkedin();
              else postLinkedinMessageOnly();
            }
            if (data.twitterSelected) postTwitter();
          }
        } else throw new Error("Bad response from Server");
      })
      .catch((err) => {
        console.log("FORM SUBMIT ERROR", err);
      });
  };

  return (
    <div>
      <div className="Test">
        <h1> Publish New Post</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          method="POST"
          encType="multipart/form-data"
        >
          <div className="image-section">
            <h2>Images:</h2>
            <div className="photo-select">
              <input
                type="file"
                id="file-select"
                accept=".jpeg,.jpg"
                {...register("photo")}
                onChange={decideSetFileSelected}
              />
              <button
                type="button"
                className={fileSelected ? "" : "hide"}
                onClick={clearFileSelect}
              >
                Remove Photo
              </button>
            </div>
          </div>
          <div className="bio-section">
            <h2>Caption:</h2>
            <textarea {...register("caption")} />
          </div>
          <div className="social-section">
            <h2>Select Where to Post:</h2>
            <label className={user.user_fb ? "" : "hide"}>
              <input
                type="checkbox"
                {...register("fbSelected", {
                  validate: {
                    checkFormData: (value) => {
                      const { photo, caption } = getValues();
                      return value ? photo.length > 0 || caption != "" : true;
                    },
                  },
                })}
              />
              Facebook
            </label>
            <label className={user.user_fb ? "" : "hide"}>
              <input
                type="checkbox"
                {...register("igSelected", {
                  validate: {
                    checkImageSelected: (value) => {
                      const { photo } = getValues();
                      return value ? (photo.length > 0 ? true : false) : true;
                    },
                  },
                })}
              />
              Instagram
            </label>
            <label className={user.user_linkedin ? "" : "hide"}>
              <input
                type="checkbox"
                {...register("linkedinSelected", {
                  validate: {
                    checkFormData: (value) => {
                      const { photo, caption } = getValues();
                      return value ? photo.length > 0 || caption != "" : true;
                    },
                  },
                })}
              />
              LinkedIn
            </label>
            <label className={user.user_twitter ? "" : "hide"}>
              <input
                type="checkbox"
                {...register("twitterSelected", {
                  validate: {
                    checkFormData: (value) => {
                      const { photo, caption } = getValues();
                      return value
                        ? photo.length === 0 && caption !== ""
                        : true;
                    },
                  },
                })}
              />
              Twitter
            </label>
          </div>
          <div className="schedule-section">
            <label className="schedule-label">Schedule Post:</label>
            <input type="checkbox" onChange={toggleTimePicker} />
            <div className={isScheduledSelected ? "time-picker" : "hide"}>
              <input
                type="date"
                id="schedule-date"
                {...register("schedule-date", {
                  validate: {
                    checkFormData: (value) => {
                      const chosenDate = new Date(value).toLocaleDateString();
                      const currentDate = new Date().toLocaleDateString();
                      return isScheduledSelected
                        ? value != "" && chosenDate >= currentDate
                        : true;
                    },
                  },
                })}
              />
              <input
                type="time"
                id="schedule_time"
                {...register("schedule_time", {
                  validate: {
                    checkFormData: (value) => {
                      let now = new Date();
                      const [selectedHours, selectedMinutes] = value.split(":");
                      let selectedTime = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        selectedHours,
                        selectedMinutes
                      );
                      const diffMs = selectedTime - now;
                      const diffMins = Math.round(
                        ((diffMs % 86400000) % 3600000) / 60000
                      );
                      return isScheduledSelected
                        ? value != "" && diffMins >= 5
                        : true;
                    },
                  },
                })}
              />
            </div>
          </div>
          {errors.igSelected && (
            <p style={{ color: "red" }}>
              Select a photo if you want to post to Instagram!
            </p>
          )}
          {(errors.fbSelected || errors.linkedinSelected) && (
            <p style={{ color: "red" }}>You can not submit an empty form!</p>
          )}
          {errors.twitterSelected && (
            <p style={{ color: "red" }}>
              Posting an Image to Twitter is not supported at the moment!
              <br />
              Please only submit a Valid text message.
            </p>
          )}
          {isScheduledSelected && errors["schedule-date"] && (
            <p style={{ color: "red" }}>
              Select a Date, today or in future, if you want to Schedule
            </p>
          )}
          {isScheduledSelected && errors.schedule_time && (
            <p style={{ color: "red" }}>
              Select a Time at least 5 minutes from now, if you want to Schedule
            </p>
          )}
          {errors.submitButton && (
            <p style={{ color: "red" }}>
              Select at least one platform to post.
            </p>
          )}
          <button
            type="submit"
            {...register("submitButton", {
              validate: {
                checkFormData: (value) => {
                  const {
                    igSelected,
                    fbSelected,
                    linkedinSelected,
                    twitterSelected,
                  } = getValues();
                  return (
                    igSelected ||
                    fbSelected ||
                    linkedinSelected ||
                    twitterSelected
                  );
                },
              },
            })}
          >
            POST
          </button>
        </form>
      </div>
    </div>
  );
}

export default Publish;
