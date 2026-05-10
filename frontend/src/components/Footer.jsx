import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo */}
        <div className="footer-logo">DailyCode</div>

        {/* Navigation Links */}
        <ul className="footer-links">
          <li><a href="#homePage">Home</a></li>
          <li><a href="#About">About Us</a></li>
          <li><a href="#Blog">Blog</a></li>
          <li><a href="#contact">Contact</a></li>
          
        </ul>

        {/* Social Icons (optional for futuristic feel) */}
        <div className="footer-social">
          <button><i className="fab fa-github"></i></button>
          <button><i className="fab fa-linkedin"></i></button>
          <button><i className="fab fa-twitter"></i></button>
        </div>

        {/* Copy */}
        <p className="footer-copy">
          © {new Date().getFullYear()} DailyCode. All rights reserved.
        </p>
      </div>
    </footer>
  );
}