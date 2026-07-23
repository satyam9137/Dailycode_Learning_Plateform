import { useEffect, useState } from "react";
import api from "../api";
import AddLevelWithTestCases from "../AdminPannel/AddLevelWithTestCases";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadProblems();
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const loadProblems = async () => {
    try {
      const res = await api.get("/problems");
      setProblems(res.data);
    } catch (err) {
      console.error("PROBLEMS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this problem?")) return;
    try {
      await api.delete(`/problems/${id}`);
      setProblems((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) {
    return <h2 style={{ color: "#fff", padding: 20 }}>Loading problems...</h2>;
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.heading}>📘 Problems</h2>
        <button
          style={styles.addBtn}
          onClick={() => setShowForm((p) => !p)}
        >
          {showForm ? "❌ Close Form" : "➕ Add Problem"}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: 20 }}>
          <AddLevelWithTestCases />
          <button
            style={{ ...styles.addBtn, marginTop: 10 }}
            onClick={() => {
              setShowForm(false);
              loadProblems();
            }}
          >
            🔄 Refresh List
          </button>
        </div>
      )}

      <div style={styles.card}>
        {problems.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No problems found</p>
        ) : isMobile ? (
          /* ========== MOBILE VIEW ========== */
          <div style={styles.mobileList}>
            {problems.map((p) => (
              <div key={p.id} style={styles.mobileCard}>
                <div style={styles.mobileRow}>
                  <span style={styles.label}>Title</span>
                  <span>{p.title}</span>
                </div>

                <div style={styles.mobileRow}>
                  <span style={styles.label}>Test Cases</span>
                  <pre style={styles.code}>
                    {p.test_cases || "No test cases"}
                  </pre>
                </div>

                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(p.id)}
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* ========== DESKTOP TABLE ========== */
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Test Cases</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((p, i) => (
                  <tr key={p.id} style={i % 2 ? styles.rowAlt : styles.row}>
                    <td style={styles.td}>{p.id}</td>
                    <td style={styles.td}>{p.title}</td>
                    <td style={styles.td}>
                      <pre style={styles.code}>
                        {p.test_cases || "No test cases"}
                      </pre>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(p.id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
    flexWrap: "wrap",
  },
  heading: {
    color: "#e5e7eb",
    fontSize: 22,
  },
  addBtn: {
    background: "#22c55e",
    border: "none",
    color: "#020617",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
  card: {
    background: "#020617",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
  },
  table: {
    width: "100%",
    minWidth: 800,
    borderCollapse: "collapse",
  },
  th: {
    padding: 12,
    color: "#38bdf8",
    borderBottom: "1px solid #1e293b",
    textAlign: "left",
    fontSize: 13,
  },
  td: {
    padding: 12,
    color: "#f1f5f9",
    borderBottom: "1px solid #1e293b",
    verticalAlign: "top",
  },
  row: { background: "#0f172a" },
  rowAlt: { background: "#020617" },

  /* MOBILE */
  mobileList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  mobileCard: {
    background: "#0f172a",
    borderRadius: 10,
    padding: 14,
    border: "1px solid #1e293b",
  },
  mobileRow: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 8,
  },
  label: {
    color: "#38bdf8",
    fontSize: 12,
    textTransform: "uppercase",
  },
  code: {
    background: "#020617",
    padding: 8,
    borderRadius: 6,
    fontSize: 13,
    whiteSpace: "pre-wrap",
    color: "#e5e7eb",
  },
  deleteBtn: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    marginTop: 8,
  },
};
