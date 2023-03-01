const fb_app_id = process.env.REACT_APP_FB_APP_ID;

export function start_fb_login() {
  window.FB.login(
    (response) => {
      console.log("login response: ", response);
    },
    { scope: "public_profile, email" }
  );
}

export function init_FB_sdk() {
  return new Promise((resolve) => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appid: fb_app_id,
        cookie: true,
        xfbml: true,
        version: "v16.0",
      });

      window.FB.getLoginStatus((response) => {
        console.log("login status: ", response);
        //resolve(response);
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  });
}
