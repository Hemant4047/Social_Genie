import img1 from "../../assests/images/Facebook/facebbok1.jpg";
import img2 from "../../assests/images/Facebook/facebbok2.jpg";
import img3 from "../../assests/images/Facebook/facebbok3.jpg";
import img4 from "../../assests/images/Facebook/facebbok4.jpg";
import img5 from "../../assests/images/Facebook/facebbok5.jpg";
import axios from "axios";

let feed = { data: null };

const data = [
  {
    full_picture: img1,
    likes: [324],
    comments: [54],
    shares: [134],
  },
  {
    full_picture: img2,
    likes: [752],
    comments: [42],
    shares: [36],
  },
  {
    full_picture: img3,
    likes: [1124],
    comments: [346],
    shares: [713],
  },
  {
    full_picture: img4,
    likes: [952],
    comments: [346],
    shares: [34],
  },
  {
    full_picture: img5,
    likes: [1262],
    comments: [246],
    shares: [613],
  },
];

const getData = async function () {
  // return data;
  await axios
    .get("http://localhost:5000" + "/oauth/facebook/fetchAllFb", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      withCredentials: true,
    })
    .then((res) => {
      feed = res.data;
      console.log("FETCHALLFB data received");
    })
    .catch((err) => {
      console.error("fetchAllFb error", err);
    });
  return feed.data;
};

// export { data, getData };
export default data;
