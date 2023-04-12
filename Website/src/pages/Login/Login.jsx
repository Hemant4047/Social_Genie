import React from "react";
import Head from "../../components/Navbar/navbar";
import "./Login.css";

function Login() {
  const serverUrl = "http://localhost:5000";

  const facebookOauth = function () {
    window.open(serverUrl + "/oauth/facebook/login", "_self");
  };

  const linkedInOauth = function () {
    window.open(serverUrl + "/oauth/linkedin/login", "_self");
  };

  const twitterOauth = function () {
    window.open(serverUrl + "/oauth/twitter/login", "_self");
  };

  return (
    <div>
      <div>{/* <Head /> */}</div>
      <div className="container">
        <span className="button" onClick={facebookOauth}>
          Login with Facebook
        </span>
        <span className="button" onClick={linkedInOauth}>
          Login with Linkedin
        </span>
        <span className="button" onClick={twitterOauth}>
          Login with Twitter
        </span>
      </div>
    </div>
  );
}

export default Login;
