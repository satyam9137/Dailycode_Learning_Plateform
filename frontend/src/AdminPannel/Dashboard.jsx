import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Card from "./Card";

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    const res = await api.get("/dashboard/counts");
    setCounts(res.data);
  };

  const handleCardClick = (type) => {
    console.log("Card clicked:", type); // ✅ test
    navigate(type);
  };

  return (
    <div>
      <h1 style={{ color: "#fff" }}>📊 Admin Dashboard</h1>

      <div style={gridStyle}>
        <Card
          title="Users"
          value={counts.users}
          onClick={() => handleCardClick("users")}
        />
        <Card
          title="Problems"
          value={counts.problems}
          onClick={() => handleCardClick("problems")}
        />
     {/* <Card
  title="Submissions"
  value={counts.leaderboard}
  onClick={() => handleCardClick("submissions")}
/> */}

        <Card
          title="Feedback"
          value={counts.feedback}
          onClick={() => handleCardClick("feedback")}
        />
      </div>
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  marginTop: "30px"
};
