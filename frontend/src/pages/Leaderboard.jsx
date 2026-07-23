import { useEffect, useState } from "react";
import api from "../api";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 LOGGED-IN USER EMAIL
  const loggedEmail = localStorage.getItem("email");

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const res = await api.get("/leaderboard");
      setUsers(res.data);
    } catch (err) {
      console.error("Leaderboard error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ padding: 20 }}>Loading leaderboard...</h2>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🏆 Leaderboard</h2>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Rank</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Level</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, index) => (
              <tr
                key={u.user_id || u.id}
                style={{
                  ...styles.row,
                  ...(u.email === loggedEmail ? styles.myRow : {}),
                }}
              >
                <td style={styles.td}>#{index + 1}</td>
                <td style={styles.td}>{u.name}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={{ ...styles.td, fontWeight: 700 }}>
                  {u.current_level}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: 24,
    background: "#0f172a",
    minHeight: "100vh",
  },
  heading: {
    color: "#e5e7eb",
    fontSize: 24,
    marginBottom: 16,
  },
  card: {
    background: "#020617",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: 12,
    color: "#38bdf8",
    borderBottom: "1px solid #1e293b",
  },
  td: {
    padding: 12,
    color: "#f1f5f9",
    borderBottom: "1px solid #1e293b",
  },
  row: {
    background: "#0f172a",
  },

  // 🔥 HIGHLIGHTED ROW
  myRow: {
    background:
      "linear-gradient(90deg, rgba(56,189,248,0.35), rgba(34,211,238,0.15))",
    boxShadow: "inset 0 0 12px rgba(56,189,248,0.45)",
    fontWeight: "bold",
  },
};
