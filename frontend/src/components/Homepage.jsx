import React from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

export default function HomePage({ isLogin, onLogin }) {
  const navigate = useNavigate();

  const handleStartCoding = (e) => {
    e.preventDefault();

    if (!isLogin) {
      // ❌ logged out → open login modal
      onLogin();
    } else {
      // ✅ logged in → go to editor
      navigate("/editor");
    }
  };

  return (
    <section id="homePage" className="homepage">
      <div className="hero">
        <div className="hero-text">
          <h1 className="title">
            Welcome to <span className="accent">DailyCode</span>
          </h1>

          <p className="subtitle">
            🚀 Daily Coding Challenges — Short tasks in Python, JavaScript, C++, Java and more.
            <strong> Levels:</strong> Easy / Medium / Hard
          </p>

          <div className="cta-row">
            {/* ✅ SMART BUTTON */}
            <button className="cta" onClick={handleStartCoding}>
              Start Coding →
            </button>

            <button className="learn">Learn more</button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif"
            alt="Developer at work"
          />
        </div>
      </div>
    </section>
  );
}
