import { useEffect, useState } from "react";
import api from "../api";

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    loadFeedback();

    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const loadFeedback = async () => {
    try {
      const res = await api.get("/feedback");
      setFeedback(res.data);
    } catch (err) {
      console.error("FEEDBACK ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={styles.loading}>Loading feedback...</h2>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>💬 User Feedback</h2>

      <div style={styles.card}>
        {feedback.length === 0 ? (
          <p style={styles.empty}>No feedback found</p>
        ) : isMobile ? (
          /* ---------------- MOBILE VIEW ---------------- */
          <div style={styles.mobileList}>
            {feedback.map((f) => (
              <div key={f.id} style={styles.mobileCard}>
                <div style={styles.mobileRow}>
                  <span style={styles.label}>Email</span>
                  <span>{f.email || "-"}</span>
                </div>

                <div style={styles.mobileRow}>
                  <span style={styles.label}>Message</span>
                  <span>{f.message}</span>
                </div>

                <div style={styles.mobileRow}>
                  <span style={styles.label}>Date</span>
                  <span>
                    {f.created_at
                      ? new Date(f.created_at).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ---------------- DESKTOP TABLE ---------------- */
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Message</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((f, index) => (
                <tr key={f.id} style={index % 2 ? styles.rowAlt : styles.row}>
                  <td style={styles.td}>{f.id}</td>
                  <td style={styles.td}>{f.email || "-"}</td>
                  <td style={{ ...styles.td, maxWidth: 400 }}>
                    {f.message}
                  </td>
                  <td style={styles.td}>
                    {f.created_at
                      ? new Date(f.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    padding: "24px",
    background: "#0f172a",
    minHeight: "100vh",
  },
  heading: {
    color: "#e5e7eb",
    marginBottom: "16px",
    fontSize: "22px",
  },
  loading: {
    color: "#e5e7eb",
    padding: 20,
  },
  card: {
    background: "#020617",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
  },

  /* -------- DESKTOP TABLE -------- */
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    background: "#020617",
    color: "#38bdf8",
    borderBottom: "1px solid #1e293b",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #1e293b",
    color: "#f1f5f9",
    fontSize: "14px",
    verticalAlign: "top",
  },
  row: {
    background: "#0f172a",
  },
  rowAlt: {
    background: "#020617",
  },

  /* -------- MOBILE CARDS -------- */
  mobileList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  mobileCard: {
    background: "#0f172a",
    borderRadius: 10,
    padding: 14,
    border: "1px solid #1e293b",
  },
  mobileRow: {
    marginBottom: 8,
    display: "flex",
    flexDirection: "column",
    fontSize: 14,
  },
  label: {
    color: "#38bdf8",
    fontSize: 12,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  empty: {
    color: "#94a3b8",
    padding: "10px",
  },
};
