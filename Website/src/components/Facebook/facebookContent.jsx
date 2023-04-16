import React, { useEffect, useState } from "react";
import schedule from "node-schedule";
import "../Instagram/instagramContent.css";
import axios from "axios";

const openInFb = function (link) {
  window.open(link, "_blank");
};

export default function FacebookContent() {
  // let user = useContext(UserContext);
  // let _data = [{ full_picture: "", likes: [], comments: [], shares: [] }];
  let [_data, setData] = useState(null);
  console.log("fb posts", _data);

  const serverUrl = "http://localhost:5000";

  useEffect(() => {
    const fetch = function () {
      console.log("Fetching the FB posts");
      axios
        .get(serverUrl + "/oauth/facebook/fetchAllFb", {
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
          console.log("FB fetch error", err);
        });
    };
    fetch();
    console.log("Starting Facebook schedule every 15 seconds");
    schedule.scheduleJob("*/15 * * * * *", function () {
      console.log("Fetching FB data");
      fetch();
    });
    return () => {
      console.log("Shutting down FB schedule");
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
                openInFb(item.permalink_url);
              }}
            >
              <img src={item.full_picture} alt="" />

              <div className="instagram-caption">
                {item.message ? item.message : ""}
              </div>
              <div className="instagram-stats">
                <h5>
                  <h5>{item.likes ? item.likes.data.length : 0}</h5>Likes
                </h5>
                <h5>
                  <h5>{item.comments ? item.comments.length : 0}</h5>Comments
                </h5>
                <h5>
                  <h5>{item.shares ? item.shares.length : 0}</h5>Shares
                </h5>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
