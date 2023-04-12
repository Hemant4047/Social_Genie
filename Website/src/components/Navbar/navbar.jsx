import "./navbar.css";
import React, { useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import axios from "axios";

const serverUrl = "http://localhost:5000";

const facebookLogout = function () {
  window.open(serverUrl + "/oauth/facebook/logout", "_self");
};

const linkedinLogout = function () {
  window.open(serverUrl + "/oauth/linkedin/logout", "_self");
};

function Head({ user }) {
  const [display, setDisplay] = useState("false");
  const changeDisplay = () => {
    setDisplay(!display);
  };
  return (
    <div className="head">
      <div className="navbar">
        <Link className="to-home" to="/home">
          <div className="logo">
            <h1 className="logo-name">Social Genie</h1>
          </div>
        </Link>
        {user.user_fb !== null ||
        user.user_linkedin !== null ||
        user.user_twitter !== null ? (
          <div className="pages">
            <Link to="/content" className="navButton">
              Content
            </Link>
            <Link to="/analytics" className="navButton">
              Analytics
            </Link>
            <Link to="/publish" className="navButton">
              Publish
            </Link>
            <Link to="/profile" className="navButton">
              Profile
            </Link>
            {/* <span className="navButton hover_pointer" onClick={facebookLogout}>
              Logout fb
            </span>
            <span className="navButton hover_pointer" onClick={linkedinLogout}>
              Logout lin
            </span> */}
          </div>
        ) : (
          // <div className="hover_pointer" onClick={facebookOauth}>
          //   login with Facebook
          // </div>
          <Link to="/login" class="navButton">
            Login
          </Link>
        )}
        <button onClick={changeDisplay}>
          <Icon.List size={30} color="white" />
        </button>
      </div>
      <div className={"dropdown " + (display ? "no-display" : "display")}>
        <ul>
          <li>
            <a href="./profile">Profile</a>
          </li>
          <li>
            <a href="./content">Content</a>
          </li>
          <li>
            <a href="./analytics">Analytics</a>
          </li>
          <li>
            <a href="./publish">Publish</a>
          </li>
          <li>
            <a href="./login">Login</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Head;
