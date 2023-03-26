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
import Head from "./components/Navbar/navbar";
import axios from "axios";
import { useEffect, useState, createContext } from "react";

export let UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    function getUser() {
      axios
        .get("http://localhost:5000/login/success", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          withCredentials: true,
        })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getUser();
  }, []);

  console.log("app.js user: ", user);
  return (
    <Router>
      <Head user={user} />
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/content" element={<Content />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Error errorMessage="404 not found" />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
