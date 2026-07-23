import Leaderboard from "./Leaderboard";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
export default function UserDash() {
    const navigate = useNavigate();
  return (
    <>
 <div>
      <header style={styles.topbar}>
        <h1 style={styles.logo}>DailyCode</h1>
       <button
  style={styles.logoutBtn}
  onClick={() => {
    localStorage.clear(); 
    navigate("/login", { replace: true }); //history reset
    window.location.reload(); //React state bhi reset
  }}
>
  Logout
</button>

      </header>
        <Leaderboard />
        <Footer />
      </div>
    </>
  );
}
const styles = {
  topbar: {
    height: 60,
    background: "#020617",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },

  logo: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    background: "linear-gradient(90deg, #b197ff, #60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "2px",
  },

  logoutBtn: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "6px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },
};
