import { useEffect, useState } from "react";
import api from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    loadUsers();

    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("USERS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={styles.loading}>Loading users...</h2>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👤 Users</h2>

      <div style={styles.card}>
        {users.length === 0 ? (
          <p style={styles.empty}>No users found</p>
        ) : isMobile ? (
          /* ================= MOBILE VIEW ================= */
          <div style={styles.mobileList}>
            {users.map((u) => (
              <div key={u.id} style={styles.mobileCard}>
                <div style={styles.mobileRow}>
                  <span style={styles.label}>ID</span>
                  <span>{u.id}</span>
                </div>

                <div style={styles.mobileRow}>
                  <span style={styles.label}>Name</span>
                  <span>{u.name}</span>
                </div>

                <div style={styles.mobileRow}>
                  <span style={styles.label}>Email</span>
                  <span>{u.email}</span>
                </div>

                <div style={styles.mobileRow}>
                  <span style={styles.label}>Joined</span>
                  <span>
                    {new Date(u.created_at).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ================= DESKTOP TABLE ================= */
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Created</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u, index) => (
                  <tr
                    key={u.id}
                    style={index % 2 ? styles.rowAlt : styles.row}
                  >
                    <td style={styles.td}>{u.id}</td>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      {new Date(u.created_at).toLocaleString("en-IN")}
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
    overflowX: "auto", // 🔥 IMPORTANT FIX
  },

  /* -------- DESKTOP TABLE -------- */
  table: {
    width: "100%",
    minWidth: "800px", // 🔥 prevents column cut
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
    whiteSpace: "nowrap",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #1e293b",
    color: "#f1f5f9",
    fontSize: "14px",
    whiteSpace: "nowrap",
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
