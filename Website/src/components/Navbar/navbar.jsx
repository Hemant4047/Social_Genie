import "./navbar.css";
import React, { useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { Link } from "react-router-dom";

function Head({ user }) {
  const [display, setDisplay] = useState("false");
  const changeDisplay = () => {
    setDisplay(!display);
  };

  const serverUrl = "http://localhost:5000";

  const facebookOauth = function () {
    window.open(serverUrl + "/oauth/login", "_self");
  };

  return (
    <div className="head">
      <div className="navbar">
        <Link className="to-home" to="/home">
          <div className="logo">
            <h1 className="logo-name">Social Genie</h1>
            <p className="logo-con">Social media, simplified</p>
          </div>
        </Link>
        <div className="pages">
          <a href="./content">Content</a>
          <a href="./analytics">Analytics</a>
          <a href="./promotions">Promotions</a>
          {user ? (
            <Link to="/profile" class="profile" href="./profile">
              Profile
            </Link>
          ) : (
            <div className="hover_pointer" onClick={facebookOauth}>
              login with Facebook
            </div>
          )}
        </div>
        <button onClick={changeDisplay}>
          <Icon.List size={30} color="white" />
        </button>
      </div>
      <div className={"dropdown " + (display ? "no-display" : "display")}>
        <ul>
          <li>
            {user ? (
              <a href="./profile">Profile</a>
            ) : (
              <div className="hover_pointer" onClick={facebookOauth}>
                login with Facebook
              </div>
            )}
          </li>
          <li>
            <a href="./content">Content</a>
          </li>
          <li>
            <a href="./analytics">Analytics</a>
          </li>
          <li>
            <a href="./promotions">Promotions</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Head;
