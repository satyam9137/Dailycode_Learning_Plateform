import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
//import UserDash from "../pages/userDash";   

export default function Navbar({ isLogin, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const email = localStorage.getItem("email");

  const [name, setName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setName(storedName);
  }, []);

  const firstLetter = name ? name.trim().charAt(0).toUpperCase() : "U";

  const links = [
    { name: "Home", id: "homePage" },
    { name: "About Us", id: "About" },
    { name: "Contact", id: "contact" },
    { name: "Blog", id: "Blog" },
  ];

  return (
    <nav style={styles.navbar}>
      {/* LOGO */}
      <Link to="/" style={styles.logo}>DailyCode</Link>

      {/* NAV LINKS */}
      <ul style={{ ...styles.navLinks, ...(menuOpen ? styles.showMenu : {}) }}>
        {links.map((link, i) => (
          <li key={i}>
            <a href={`#${link.id}`} style={styles.link}>
              {link.name}
            </a>
          </li>
        ))}

        {/* ================= AUTH SECTION ================= */}
        {!isLogin ? (
          <li>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
          </li>
        ) : (
          <li style={{ position: "relative" }}>
            {/* PROFILE ICON */}
            <div
              style={styles.avatar}
              onClick={() => setProfileOpen(!profileOpen)}
            >
              {firstLetter}
            </div>

            {profileOpen && (
              <div style={styles.dropdown}>
                <p style={styles.profileName}>{name}</p>
                <p style={styles.profileEmail}>{email}</p>
               <Link
  to="/userDash"
  style={{ ...styles.link, display: "block", margin: "10px 0" }}
  onClick={() => setProfileOpen(false)}
>
  View
</Link>


                <hr style={{ margin: "10px 0", borderColor: "#334155" }} />

                <button
                  style={styles.logoutBtn}
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        )}
      </ul>

      {/* HAMBURGER */}
      <button
        style={styles.menuBtn}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>
    </nav>
  );
}

/* ================= STYLES ================= */

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    background: "rgba(17, 24, 39, 0.85)",
    backdropFilter: "blur(10px)",
    color: "white",
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2rem",
    zIndex: 1000,
  },

  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#38bdf8",
    textDecoration: "none",
  },

  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "2rem",
    alignItems: "center",
  },

  link: {
    color: "white",
    fontSize: "1.05rem",
    cursor: "pointer",
    textDecoration: "none",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#38bdf8",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    cursor: "pointer",
  },

  dropdown: {
    position: "absolute",
    top: "45px",
    right: 0,
    background: "#0f172a",
    borderRadius: "8px",
    padding: "12px",
    width: "220px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
    zIndex: 2000,
  },

  profileName: {
    fontWeight: "bold",
    color: "#38bdf8",
    marginBottom: "4px",
  },

  profileEmail: {
    fontSize: "0.85rem",
    color: "#cbd5e1",
    wordBreak: "break-all",
  },

  logoutBtn: {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    background: "#ef4444",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  menuBtn: {
    display: "none",
    fontSize: "2rem",
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
  },

  showMenu: {
    position: "absolute",
    top: "70px",
    left: 0,
    width: "100%",
    background: "#0f172a",
    padding: "1rem",
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
};
