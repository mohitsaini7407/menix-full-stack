import React from "react";

const Home = () => {
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      background: "#f0f0f0", // Optional: background for the rest of the page
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        height: "100vh",
        width: "50vw",
        background: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.05)"
      }}>
        {/* Blank white half-page */}
      </div>
    </div>
  );
};

export default Home;