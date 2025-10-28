// src/components/MinionMotion.jsx
import React from "react";

const MinionMotion = ({ isTyping }) => {
  return (
    <div className="text-center" style={{ marginRight: "200px" }}> {/* add marginRight to reduce gap */}
      <img
        src={
          isTyping
            ? "http://media.giphy.com/media/dgz2bOGzDKbvO/giphy.gif" // happy minion
            : "https://media4.giphy.com/media/eSQJfZdhGDrEMhfSmg/giphy.gif?cid=6c09b952mb"
        }
        alt="Minion Mood"
        style={{
          width: "400px", // 🔥 increased from 280px
          height: "auto",
          borderRadius: "20px",
          transform: isTyping ? "scale(1.15)" : "scale(1)",
          transition: "all 0.4s ease",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        }}
      />
      {/* 💬 Cute message below the Minion */}
      <p
        style={{
          marginTop: "30px",
          fontSize: "1.1rem",
          fontWeight: "500",
          color: isTyping ? "#292e2fff" : "#555",
          textShadow: isTyping
            ? "0px 0px 5px rgba(36, 36, 35, 0.7)"
            : "none",
          transition: "color 0.3s ease",
        }}
      >
        {isTyping
          ? "💛 Bee-do! You’re typing! Let’s log in together! 🥳"
          : "😢 Oh no... I’m bored. Register to make me happy! 💛"}
      </p>
    </div>
  );
};

export default MinionMotion;
