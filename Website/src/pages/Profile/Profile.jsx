import React, { useContext } from "react";
import Head from "../../components/Navbar/navbar";

import graph from "../../assests/images/chart.svg";
import "./Profile.css";
import { UserContext } from "../../App";

export default function Profile() {
  const serverUrl = "http://localhost:5000";
  let user = useContext(UserContext);
  console.log("profile user: ", user);

  const facebookPostMessage = function () {
    window.open(serverUrl + "/oauth/postMessage", "_self");
  };

  const facebookLogout = function () {
    window.open(serverUrl + "/oauth/logout", "_self");
  };

  return (
    <div className="profile-page">
      {/* <Head /> */}
      <div className="banner">
        <div></div>
      </div>
      <div className="profile-content">
        <div className="hover_pointer" onClick={facebookPostMessage}>
          Post on Facebook
        </div>
        <div className="hover_pointer" onClick={facebookLogout}>
          Log out from Facebook
        </div>
        <h1>{user.displayName}</h1>
        <h4>{user.email}</h4>
        <div className="flex">
          <div>
            <h2>Social handles connected</h2>
            <h4>Facebook</h4>
            <h4>Instagram</h4>
            <h4>Youtube</h4>
          </div>
          <br />
          <div>
            <h2>Content Reach</h2>
            <img src={graph} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
