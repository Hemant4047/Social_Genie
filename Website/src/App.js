import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Content from "./pages/Content/Content";
import Error from "./pages/Error/Error";
import Analytics from "./pages/Analytics/Analytics";
import Profile from "./pages/Profile/Profile";
import Publish from "./pages/Publish/Publish";
import Login from "./pages/Login/Login";
import Head from "./components/Navbar/navbar";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export let UserContext = createContext();

function App() {
  const [user_fb, setUser_fb] = useState(null);
  const [user_linkedin, setUser_linkedin] = useState(null);
  const [user_twitter, setUser_twitter] = useState(null);

  useEffect(() => {
    function getUser_fb() {
      axios
        .get("http://localhost:5000/oauth/facebook/user", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          withCredentials: true,
        })
        .then((response) => {
          // console.log("inside useeffect");
          setUser_fb(response.data.user);
        })
        .catch((err) => {
          console.log("GET FACEBOOK USER ERROR", err);
        });
    }
    function getUser_linkedin() {
      axios
        .get("http://localhost:5000/oauth/linkedin/user", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          withCredentials: true,
        })
        .then((response) => {
          // console.log("Fetched Linkedin User, ", response.data.user);
          setUser_linkedin(response.data.user);
        })
        .catch((err) => {
          console.log("GET LINKEDIN USER ERROR", err);
        });
    }
    function getUser_twitter() {
      axios
        .get("http://localhost:5000/oauth/twitter/user", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          withCredentials: true,
        })
        .then((response) => {
          // console.log("Fetched Twitter User, ", response.data.user);
          setUser_twitter(response.data.user);
        })
        .catch((err) => {
          console.log("GET TWITTER USER ERROR", err);
        });
    }
    getUser_fb();
    getUser_linkedin();
    getUser_twitter();
  }, []);

  console.log("app.js user_fb exists ", user_fb !== null);
  console.log("app.js user_linkedin exists ", user_linkedin !== null);
  console.log("app.js user_twitter exists ", user_twitter !== null);

  return (
    <Router>
      <Head user={{ user_fb, user_linkedin, user_twitter }} />
      <UserContext.Provider value={{ user_fb, user_linkedin, user_twitter }}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/content" element={<Content />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Error errorMessage="404 not found" />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
