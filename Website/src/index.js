import React from "react";
import ReactDOM from "react-dom";
// import reportWebVitals from "./reportWebVitals";
import App from "./App";

import { init_FB_sdk } from "./helpers/init-facebook-sdk";

function startLogin(inital_response) {
  window.FB.login(
    function (response) {
      console.log("login response: ", response);
    },
    { scope: "public_profile, email" }
  );
}

init_FB_sdk().then((response) => startLogin(response));

function startApp() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
