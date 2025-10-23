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

  useEffect(() => {
    const fetchData = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      try {
        const response = await axios.get(`${API_URL}/api/Registration/users/`);
        const data = response.data;
        const skillsSet = new Set();
        const statesSet = new Set();

        const formattedData = await Promise.all(
          data.map(async (user) => {
            const emailEncoded = encodeURIComponent(user.email);
            const profilePictureURL = `${API_URL}/api/users/profile-picture/${emailEncoded}/`;

            const profilePicture = await fetch(profilePictureURL)
              .then(async (res) => {
                if (!res.ok) throw new Error("No profile picture found");
                const data = await res.json();
                return data.profile_picture
                  ? `${API_URL}${data.profile_picture}`
                  : "https://tse4.mm.bing.net/th/id/OIP.Yaficbwe3N2MjD2Sg0J9OgHaHa?pid=Api&P=0&h=180";
              })
              .catch(() => "https://tse4.mm.bing.net/th/id/OIP.Yaficbwe3N2MjD2Sg0J9OgHaHa?pid=Api&P=0&h=180");

            const scoreResponse = await axios.get(`${API_URL}/api/friends/scores/${emailEncoded}/`);
            const scores = scoreResponse.data.map((entry) => entry.score);
            const averageScore = scores.length > 0
              ? scores.reduce((acc, score) => acc + score, 0) / scores.length
              : 0;

            skillsSet.add(user.skills);
            statesSet.add(user.state);

            return {
              id: user.id,
              full_name: user.full_name,
              name: user.full_name,
              location: `${user.city}, ${user.state}`,
              email: user.email,
              skills: user.skills ? user.skills.split(", ") : [],
              desiredSkills: user.desired_skills ? user.desired_skills.split(", ") : [],
              qualification: user.qualification || "N/A",
              year_of_experience: user.year_of_experience || 0,
              rating: averageScore.toFixed(2) || "N/A",
              img: profilePicture,
              message: `Looking to exchange ${user.skills} skills for ${user.desired_skills} knowledge.`,
            };
          })
        );

        setSkillsOptions([...skillsSet]);
        setStatesOptions([...statesSet]);
        setForumPostsList(formattedData.filter((post) => post.id !== loggedInUser.id));
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const toggleSkills = () => {
    setShowSkills(!showSkills);
    setShowLocations(false);
    if (!showSkills && skillsRef.current) setTimeout(() => skillsRef.current.scrollIntoView({ behavior: "smooth" }), 300);
  };

  const toggleLocations = () => {
    setShowLocations(!showLocations);
    setShowSkills(false);
    if (!showLocations && locationsRef.current) setTimeout(() => locationsRef.current.scrollIntoView({ behavior: "smooth" }), 300);
  };

  const handleSkillChange = (e) => setSelectedSkill(e.target.value);
  const handleLocationChange = (e) => setSelectedLocation(e.target.value);

  const handleSearchBySkill = () => {
    if (!selectedSkill) return;
    navigate("/skill-profile-view", {
      state: { searchType: "skill", searchTerm: selectedSkill, profiles: forumPostsList },
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

      {/* Hero Section */}
      <div
        style={{
          position: "relative",
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          overflow: "hidden",
          color: "white",
          padding: "20px",
          background: "linear-gradient(135deg, #ffe6f0, #ffcce6, #ffb3d9)", // deeper and vibrant


        }}
      >
        {/* Floating GIFs */}
        {/* Floating GIFs */}
<img
  src="/images/lightbulb.gif"
  alt="lightbulb"
  style={{
    position: "absolute",
    top: "5%",
    left: "5%",
    width: "50px",
    animation: "float1 5s ease-in-out infinite",
  }}
/>
<img
  src="/images/brain.gif"
  alt="brain"
  style={{
    position: "absolute",
    top: "10%",
    right: "5%",
    width: "55px",
    animation: "float2 6s ease-in-out infinite",
  }}
/>
<img
  src="/images/handshake.gif"
  alt="handshake"
  style={{
    position: "absolute",
    bottom: "20%",
    left: "10%",
    width: "60px",
    animation: "float3 7s ease-in-out infinite",
  }}
/>
<img
  src="/images/grad.gif"
  alt="graduation"
  style={{
    position: "absolute",
    bottom: "15%",
    right: "15%",
    width: "55px",
    animation: "float4 5.5s ease-in-out infinite",
  }}
/>
<img
  src="/images/book.gif"
  alt="book"
  style={{
    position: "absolute",
    top: "30%",
    left: "25%",
    width: "50px",
    animation: "float1 5s ease-in-out infinite",
  }}
/>
<img
  src="/images/laptop.gif"
  alt="laptop"
  style={{
    position: "absolute",
    top: "35%",
    right: "30%",
    width: "50px",
    animation: "float2 6s ease-in-out infinite",
  }}
/>
<img
  src="/images/penn.gif"
  alt="pen"
  style={{
    position: "absolute",
    bottom: "35%",
    left: "50%",
    width: "45px",
    animation: "float3 7s ease-in-out infinite",
  }}
/>


        {/* Hero Text */}
        <h1 style={{ fontWeight: "bold", marginBottom: 0, zIndex: 1 ,color:"#6A38C2"}}>Welcome to</h1>
        <h1 style={{ fontWeight: "bold", marginTop: 0, zIndex: 1 }}>
          <span style={{ color: "#6A38C2" }}>Skill</span>
          <span style={{ color: "#343434" }}>Barter</span>
          <span style={{ color: "#6A38C2" }}>.in</span>
        </h1>
        <p style={{ marginTop: 10, zIndex: 1 }}>
          <span style={{ color: "#343434" }}>India</span> ka apna skill barteting{" "}
          <span style={{ color: "#343434" }}>platform</span>
        </p>

        {/* Buttons */}
        <div className="mt-4 d-flex justify-content-center" style={{ zIndex: 1 }}>
          <button
            className="btn mx-2"
            style={{ backgroundColor: "#6A38C2", color: "white", border: "none", padding: "10px 20px", fontWeight: "bold", borderRadius: "25px" }}
            onClick={toggleSkills}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#343434")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#6A38C2")}
          >
            Search by Skill
          </button>
          <button
            className="btn mx-2"
            style={{ backgroundColor: "#6A38C2", color: "white", border: "none", padding: "10px 20px", fontWeight: "bold", borderRadius: "25px" }}
            onClick={toggleLocations}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#343434")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#6A38C2")}
          >
            Search by Location
          </button>
        </div>
      </div>

      {/* Add CSS animations for GIFs */}
      <style>{`
        @keyframes float1 { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        @keyframes float2 { 0% { transform: translateY(0px); } 50% { transform: translateY(-25px); } 100% { transform: translateY(0px); } }
        @keyframes float3 { 0% { transform: translateY(0px); } 50% { transform: translateY(-30px); } 100% { transform: translateY(0px); } }
        @keyframes float4 { 0% { transform: translateY(0px); } 50% { transform: translateY(-22px); } 100% { transform: translateY(0px); } }
      `}</style>

      {/* Search Sections */}
      <div className="container mt-5 p-4" style={{ borderRadius: "10px", background: "#f9f9f9" }}>
        {showSkills && (
          <div className="mt-4" ref={skillsRef}>
            <h2>Search by Skills</h2>
            <p>Find barter opportunities based on your skills.</p>
            <form>
              <div className="form-group">
                <label htmlFor="skillInput">Select Skill</label>
                <select className="form-control" id="skillInput" value={selectedSkill} onChange={handleSkillChange}>
                  <option value="" disabled>Select a skill</option>
                  {skillsOptions.map((skill, index) => (<option key={index} value={skill}>{skill}</option>))}
                </select>
              </div>
              <button type="button" className="btn btn-primary mt-2 w-100" onClick={handleSearchBySkill} disabled={!selectedSkill}>
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
                <select className="form-control" id="locationInput" value={selectedLocation} onChange={handleLocationChange}>
                  <option value="" disabled>Select a state</option>
                  {statesOptions.map((state, index) => (<option key={index} value={state}>{state}</option>))}
                </select>
              </div>
              <button type="button" className="btn btn-primary mt-2 w-100" onClick={handleSearchByLocation} disabled={!selectedLocation}>
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Forum Cards */}
      <RecentForumCards forumPosts={forumPostsList} />
    </>
  );
};

export default Dashboard;
