import React, { useEffect, useState } from "react";
import "./instagramContent.css";
import axios from "axios";
import schedule from "node-schedule";
// import data from "./instagramData";

const openInIg = function (link) {
  window.open(link, "_blank");
};

export default function InstagramContent() {
  let [_data, setData] = useState(null);
  console.log("ig posts: ", _data);

  const serverUrl = "http://localhost:5000";

  useEffect(() => {
    const fetch = function () {
      console.log("Fetching the IG posts");
      axios
        .get(serverUrl + "/oauth/facebook/fetchAllIg", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          withCredentials: true,
        })
        .then((res) => {
          setData(res.data.data);
        })
        .catch((err) => {
          console.log("IG fetch error", err);
        });
    };
    fetch();
    console.log("Starting IG schedule every 15 seconds");
    schedule.scheduleJob("*/15 * * * * *", function () {
      // console.log("IG scheduled every 15 seconds");
      fetch();
    });
    return () => {
      console.log("Shutting down IG Schedule");
      schedule.gracefulShutdown();
    };
  }, []);

  return (
    <div className="instagram-content">
      <div className="instagram-cards">
        {_data === null ? (
          <p>Loading ...</p>
        ) : (
          _data.map((item) => (
            <div
              className="instagram-card"
              onClick={() => {
                openInIg(item.permalink);
              }}
            >
              <img src={item.media_url} alt="" />

              <div className="instagram-caption">
                {item.caption ? item.caption : ""}
              </div>
              <div className="instagram-stats">
                <h5>
                  <h5>{item.like_count}</h5>Likes
                </h5>
                <h5>
                  <h5>{item.comments_count}</h5>Comments
                </h5>
                {/* <h5>
                  <h5>{item.shares ? item.shares.length : 0}</h5>Shares
                </h5> */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
