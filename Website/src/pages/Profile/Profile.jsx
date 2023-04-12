import React, { useContext } from "react";
import { CheckLg, XLg } from "react-bootstrap-icons";
import graph from "../../assests/images/chart.svg";
import "./Profile.css";
import { UserContext } from "../../App";

const serverUrl = "http://localhost:5000";

export default function Profile() {
  let user = useContext(UserContext);

  const facebookOauth = function () {
    if (!user.user_fb)
      window.open(serverUrl + "/oauth/facebook/login", "_self");
    else window.open(serverUrl + "/oauth/facebook/logout", "_self");
  };
  const linkedInOauth = function () {
    if (!user.user_linkedin)
      window.open(serverUrl + "/oauth/linkedin/login", "_self");
    else window.open(serverUrl + "/oauth/linkedin/logout", "_self");
  };
  const twitterOauth = function () {
    if (!user.user_twitter)
      window.open(serverUrl + "/oauth/twitter/login", "_self");
    else window.open(serverUrl + "/oauth/twitter/logout", "_self");
  };

  return (
    <div className="profile-page">
      <div className="banner">
        <div></div>
      </div>
      <div className="profile-content">
        <h1>Tarun</h1>
        <h4>Tarun@gmail.com</h4>
        <div className="flex">
          <div>
            <h2>Social handles</h2>
            <div className="icon-status">
              <h4>Facebook</h4>
              {user.user_fb ? (
                <div className="status">
                  <CheckLg className="_icon" />
                  <span className="pointer" onClick={facebookOauth}>
                    Logout
                  </span>
                </div>
              ) : (
                <div className="status">
                  <XLg className="_icon" />
                  <span className="pointer" onClick={facebookOauth}>
                    Connect
                  </span>
                </div>
              )}
            </div>
            <div className="icon-status">
              <h4>Instagram</h4>
              {user.user_fb ? (
                <div className="status">
                  <CheckLg className="_icon" />
                  <span className="pointer" onClick={facebookOauth}>
                    Logout
                  </span>
                </div>
              ) : (
                <div className="status">
                  <XLg className="_icon" />
                  <span className="pointer" onClick={facebookOauth}>
                    Connect
                  </span>
                </div>
              )}
            </div>
            <div className="icon-status">
              <h4>Linkedin</h4>
              {user.user_linkedin ? (
                <div className="status">
                  <CheckLg className="_icon" />
                  <span className="pointer" onClick={linkedInOauth}>
                    Logout
                  </span>
                </div>
              ) : (
                <div className="status">
                  <XLg className="_icon red" />
                  <span className="pointer" onClick={linkedInOauth}>
                    Connect
                  </span>
                </div>
              )}
            </div>
            <div className="icon-status">
              <h4>Twitter</h4>
              {user.user_twitter ? (
                <div className="status">
                  <CheckLg className="_icon" />
                  <span className="pointer" onClick={twitterOauth}>
                    Logout
                  </span>
                </div>
              ) : (
                <div className="status">
                  <XLg className="_icon red" />
                  <span className="pointer" onClick={twitterOauth}>
                    Connect
                  </span>
                </div>
              )}
            </div>
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
