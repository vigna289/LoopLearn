import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../shared/Navbar";
import RecentForumCards from "./recentForumCard";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [showSkills, setShowSkills] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [forumPostsList, setForumPostsList] = useState([]);
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [statesOptions, setStatesOptions] = useState([]);

  const skillsRef = useRef(null);
  const locationsRef = useRef(null);
  const forumRef = useRef(null);
  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      

      try {
        const response = await axios.get(`${API_URL}/api/Registration/users/`);
        const data = response.data;
        console.log("response",data)

        const skills = new Set();
        const states = new Set();

        const formattedData = await Promise.all(
          data.map(async (user) => {
            const emailEncoded = user.email.replace("@", "%40");
            const profilePictureURL = `${API_URL}/api/users/profile-picture/${emailEncoded}/`;

            // Fetch profile picture with fallback default
            const profilePicture = await fetch(profilePictureURL)
              .then(async (res) => {
                if (!res.ok) throw new Error("No profile picture found");
                const data = await res.json();
                return data.profile_picture
                  ? `${API_URL}${data.profile_picture}`
                  : "https://tse4.mm.bing.net/th/id/OIP.Yaficbwe3N2MjD2Sg0J9OgHaHa?pid=Api&P=0&h=180";
              })
              .catch((err) => {
                console.error("Error fetching profile picture:", err);
                return "https://tse4.mm.bing.net/th/id/OIP.Yaficbwe3N2MjD2Sg0J9OgHaHa?pid=Api&P=0&h=180";
              });

            // Fetch scores
            const scoreResponse = await axios.get(
              `${API_URL}/api/friends/scores/${emailEncoded}/`
            );
            const scores = scoreResponse.data.map((entry) => entry.score);
            const averageScore =
              scores.length > 0
                ? scores.reduce((acc, score) => acc + score, 0) / scores.length
                : 0;

            skills.add(user.skills);
            states.add(user.state);

            return {
              id: user.id,
              full_name: user.full_name,
              name: user.full_name,
              location: `${user.city}, ${user.state}`,
              email: user.email,
              skills: user.skills ? user.skills.split(", ") : [],
              desiredSkills: user.desired_skills
                ? user.desired_skills.split(", ")
                : [],
               qualification: user.qualification || "N/A", // ✅ add this  
               year_of_experience: user.year_of_experience || 0, // ✅ add this
              rating: averageScore.toFixed(2) || "N/A",
              img: profilePicture,
              message: `Looking to exchange ${user.skills} skills for ${user.desired_skills} knowledge.`,
            };
          })
        );

        setSkillsOptions([...skills]);
        setStatesOptions([...states]);
        setForumPostsList(
          formattedData.filter((post) => post.id !== loggedInUser.id)
        ); // Exclude logged-in user
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Toggle skill/location sections with smooth scroll
  const toggleSkills = () => {
    setShowSkills(!showSkills);
    setShowLocations(false);
    if (!showSkills && skillsRef.current) {
      setTimeout(() => {
        skillsRef.current.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const toggleLocations = () => {
    setShowLocations(!showLocations);
    setShowSkills(false);
    if (!showLocations && locationsRef.current) {
      setTimeout(() => {
        locationsRef.current.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  // Handle selection changes
  const handleSkillChange = (e) => setSelectedSkill(e.target.value);
  const handleLocationChange = (e) => setSelectedLocation(e.target.value);
 console.log(forumPostsList)
  // Handle search button clicks
  const handleSearchBySkill = () => {
    if (!selectedSkill) return;
    navigate("/skill-profile-view", {
      state: { searchType: "skill", searchTerm: selectedSkill ,profiles: forumPostsList    },
    });
  };

  const handleSearchByLocation = () => {
    if (!selectedLocation) return;
    navigate("/location-profile-view", {
      state: { searchType: "location", searchTerm: selectedLocation },
    });
  };

  return (
    <>
      <CustomNavbar />

      <div
        className="d-flex justify-content-center align-items-center text-center"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          color: "black",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <h1 style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold", marginBottom: 0 }}>
          Welcome to
        </h1>
        <h1 style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold", marginTop: 0 }}>
          <span style={{ color: "black" }}>Skill</span>
          <span style={{ color: "#F83002" }}>Barter</span>
          <span style={{ color: "black" }}>.in</span>
        </h1>
        <p className="lead" style={{ fontFamily: "Arial, sans-serif", marginTop: 10 }}>
          <span style={{ color: "#F83002" }}>India</span> ka apna skill barteting{" "}
          <span style={{ color: "#F83002" }}>platform</span>
        </p>

        <div className="mt-4 d-flex justify-content-center">
          <button
            className="btn mx-2"
            style={{
              backgroundColor: "#6A38C2",
              color: "white",
              border: "none",
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "25px",
              transition: "background-color 0.3s ease",
            }}
            onClick={toggleSkills}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#F83002")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#6A38C2")}
          >
            Search by Skill
          </button>

          <button
            className="btn mx-2"
            style={{
              backgroundColor: "#6A38C2",
              color: "white",
              border: "none",
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "25px",
              transition: "background-color 0.3s ease",
            }}
            onClick={toggleLocations}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#F83002")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#6A38C2")}
          >
            Search by Location
          </button>
        </div>
      </div>

      <div className="container mt-5">
        {showSkills && (
          <div className="mt-4" ref={skillsRef}>
            <h2>Search by Skills</h2>
            <p>Find barter opportunities based on your skills.</p>
            <form>
              <div className="form-group">
                <label htmlFor="skillInput">Select Skill</label>
                <select
                  className="form-control"
                  id="skillInput"
                  value={selectedSkill}
                  onChange={handleSkillChange}
                  style={{ maxWidth: "100%", width: "100%" }}
                >
                  <option value="" disabled>
                    Select a skill
                  </option>
                  {skillsOptions.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="btn btn-primary mt-2 w-100"
                onClick={handleSearchBySkill}
                disabled={!selectedSkill}
              >
                Search
              </button>
            </form>
          </div>
        )}

        {showLocations && (
          <div className="mt-4" ref={locationsRef}>
            <h2>Search by Location</h2>
            <p>Find barter opportunities based on your location.</p>
            <form>
              <div className="form-group">
                <label htmlFor="locationInput">Select State</label>
                <select
                  className="form-control"
                  id="locationInput"
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  style={{ maxWidth: "100%", width: "100%" }}
                >
                  <option value="" disabled>
                    Select a state
                  </option>
                  {statesOptions.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="btn btn-primary mt-2 w-100"
                onClick={handleSearchByLocation}
                disabled={!selectedLocation}
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      <RecentForumCards forumPosts={forumPostsList} />

      <div className="container mt-5" ref={forumRef}>
        <div
          className="mt-5"
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "15px",
            marginTop: "20px",
            margin: "auto",
            transition: "max-height 0.3s ease",
            borderRadius: "10px",
            maxWidth: "800px",
          }}
        >
          <h3 className="text-center mb-4">All Forum Posts</h3>
          {forumPostsList.length === 0 ? (
            <p className="text-center">No posts yet. Be the first to post!</p>
          ) : (
            <ul className="list-group">
              {forumPostsList.map((post, index) => (
                <li
                  key={index}
                  className="list-group-item"
                  style={{
                    marginBottom: "15px",
                    padding: "20px",
                    transition: "transform 0.3s ease",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate("/recent-barter-profile-view", { state: { profile: post } })
                  }
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={post.img}
                      alt="Profile"
                      className="rounded-circle mr-3"
                      style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "15px" }}
                    />
                    <div>
                      <h5>{post.name}</h5>
                      <p>{post.message}</p>
                      <p>
                        <strong>Desired Skills:</strong> {post.desiredSkills.join(", ")}
                      </p>
                      <p>
                        <strong>Rating:</strong> {post.rating}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
