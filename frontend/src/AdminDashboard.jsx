import { Routes, Route, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./AdminPannel/Dashboard";
import Users from "./pages/Users";
import Problems from "./pages/Problems";
import Feedback from "./pages/Feedback";
import Leaderboard from "./pages/Leaderboard";
import Footer from "./components/Footer";
import { color, font } from "./AdminPannel/theme";
import {
  GridIcon,
  UsersIcon,
  ProblemsIcon,
  FeedbackIcon,
  TrophyIcon,
  LogoutIcon,
  MenuIcon,
} from "./AdminPannel/icons";
import logoIcon from "./assets/logo-icon.png";

export default function AdminDashboard() {
  return (
    <>
      <AdminLayout />
      <Footer />
    </>
  );
}

const MENU = [
  { path: "/admin/dashboard", label: "Overview", Icon: GridIcon },
  { path: "/admin/dashboard/users", label: "Users", Icon: UsersIcon },
  { path: "/admin/dashboard/problems", label: "Problems", Icon: ProblemsIcon },
  { path: "/admin/dashboard/feedback", label: "Feedback", Icon: FeedbackIcon },
  { path: "/admin/dashboard/leaderboard", label: "Leaderboard", Icon: TrophyIcon },
];

/* ================= ADMIN LAYOUT ================= */
function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onResize = () => setSidebarOpen(window.innerWidth > 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const active = MENU.find((m) =>
    m.path === "/admin/dashboard"
      ? location.pathname === m.path || location.pathname === m.path + "/"
      : location.pathname.startsWith(m.path)
  );

  return (
    <div style={styles.app}>
      {/* TOP BAR */}
      <header style={styles.topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            style={styles.menuBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <MenuIcon />
          </button>
          <img src={logoIcon} alt="DailyCode" style={styles.logoIcon} />
          <span style={styles.logo}>DailyCode</span>
          <span style={styles.crumbDivider}>/</span>
          <span style={styles.crumbCurrent}>{active?.label || "Admin"}</span>
        </div>

        <button
          style={styles.logoutBtn}
          onClick={() => {
            localStorage.clear();
            navigate("/login", { replace: true });
            window.location.reload();
          }}
        >
          <LogoutIcon size={15} />
          Log out
        </button>
      </header>

      {/* LAYOUT */}
      <div style={styles.layout}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          closeSidebar={() => window.innerWidth <= 768 && setSidebarOpen(false)}
        />

        <main style={styles.content}>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="problems" element={<Problems />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/* ================= SIDEBAR ================= */
function Sidebar({ sidebarOpen, closeSidebar }) {
  return (
    <>
      {sidebarOpen && window.innerWidth <= 768 && (
        <div style={styles.overlay} onClick={closeSidebar} />
      )}

      <aside
        style={{
          ...styles.sidebar,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <nav style={styles.nav}>
          {MENU.map(({ path, label, Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin/dashboard"}
              onClick={closeSidebar}
              style={({ isActive }) => ({
                ...styles.navItem,
                background: isActive ? color.accentSoft : "transparent",
                color: isActive ? color.accent : color.textSecondary,
              })}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

/* ================= STYLES ================= */
const styles = {
  app: {
    minHeight: "100vh",
    background: color.bg,
    color: color.textPrimary,
    fontFamily: font.ui,
  },
  topbar: {
    height: 60,
    background: color.surface,
    borderBottom: `1px solid ${color.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  logo: { fontWeight: 700, fontSize: 15.5, letterSpacing: "-0.01em" },
  logoIcon: { height: 28, width: 28, borderRadius: 7, objectFit: "contain", flexShrink: 0 },
  crumbDivider: { color: color.textTertiary, fontSize: 14 },
  crumbCurrent: { color: color.textSecondary, fontSize: 14, fontWeight: 500 },
  menuBtn: {
    background: "none",
    border: "none",
    color: color.textPrimary,
    cursor: "pointer",
    display: "flex",
    padding: 4,
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "transparent",
    border: `1px solid ${color.border}`,
    color: color.textSecondary,
    padding: "7px 13px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13.5,
    fontWeight: 500,
  },
  layout: { display: "flex" },
  sidebar: {
    width: 232,
    background: color.surface,
    borderRight: `1px solid ${color.border}`,
    position: "fixed",
    top: 60,
    bottom: 0,
    left: 0,
    transition: "transform 0.22s ease",
    zIndex: 40,
    overflowY: "auto",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    padding: 14,
    gap: 3,
  },
  navItem: {
    padding: "10px 12px",
    cursor: "pointer",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    gap: 11,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    transition: "background 0.15s ease, color 0.15s ease",
  },
  content: {
    flex: 1,
    padding: "28px 28px 40px",
    marginLeft: 232,
    minWidth: 0,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 30,
  },
};

if (window.innerWidth <= 768) {
  styles.sidebar.top = 60;
  styles.content.marginLeft = 0;
}
