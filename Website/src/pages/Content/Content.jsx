import { useState, useContext } from "react";
import FacebookContent from "../../components/Facebook/facebookContent";
import InstagramContent from "../../components/Instagram/instagramContent";
import YoutubeContent from "../../components/Youtube/youtubeContent";
import { UserContext } from "../../App";

import "./Content.css";

function Content() {
  let user = useContext(UserContext);
  const [media, setMedia] = useState("instagram");

  if (!user.user_fb)
    return (
      <div className="login-message">
        Please Login with your facebook account to see your posts.
      </div>
    );

  return (
    <div className="content">
      <div className="info">
        <form className="social">
          <select
            value={media}
            onChange={(e) => {
              setMedia(e.target.value);
            }}
            name="media"
          >
            <option value="instagram">Instagram</option>
            {/* <option value="youtube">Youtube</option> */}
            <option value="facebook">Facebook</option>
          </select>
        </form>
        <hr />
        {media === "instagram" ? (
          <InstagramContent />
        ) : (
          <FacebookContent />
          // <p>facebook</p>
        )}
      </div>
    </div>
  );
}

export default Content;
