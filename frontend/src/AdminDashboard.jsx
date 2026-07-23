// import { Routes, Route, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Dashboard from "./AdminPannel/Dashboard";
// import Users from "./pages/Users";
// import Problems from "./pages/Problems";
// //import Submissions from "./pages/Submissions";
// import Feedback from "./pages/Feedback";
// import Leaderboard from "./pages/Leaderboard";
// import Footer from "./components/Footer";
// export default function AdminDashboard() {
//   return (
    
// <>
//     <AdminLayout/>

//        <Footer/>
//    </>
    
//   );
// }

// /* ================= ADMIN LAYOUT ================= */
// function AdminLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const onResize = () => setSidebarOpen(window.innerWidth > 768);
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   return (
//     <div style={styles.app}>
//       {/* TOP BAR */}
//       <header style={styles.topbar}>
//         <button
//           style={styles.menuBtn}
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//         >
//           ☰
//         </button>
//         <h1 style={styles.logo}>DailyCode</h1>
//        <button
//   style={styles.logoutBtn}
//   onClick={() => {
//     localStorage.clear(); // 🔥 sab kuch clear
//     navigate("/login", { replace: true }); // 🔥 history reset
//     window.location.reload(); // 🔥 React state bhi reset
//   }}
// >
//   Logout
// </button>

//       </header>

//       {/* LAYOUT */}
//       <div style={styles.layout}>
//         <Sidebar
//           sidebarOpen={sidebarOpen}
//           closeSidebar={() => setSidebarOpen(false)}
//         />

//         <main style={styles.content}>
//           <Routes>
//   <Route path="/" element={<Dashboard />} />
//   <Route path="users" element={<Users />} />
//   <Route path="problems" element={<Problems />} />
//   <Route path="feedback" element={<Feedback />} />
//   <Route path="leaderboard" element={<Leaderboard />} />
// </Routes>

//         </main>
//       </div>
//     </div>
//   );
// }

// /* ================= SIDEBAR ================= */
// function Sidebar({ sidebarOpen, closeSidebar }) {
//   const navigate = useNavigate();
//   const [active, setActive] = useState("/");

//   const menu = [
//   { path: "", label: "Overview", icon: "📊" },
//   { path: "users", label: "Users", icon: "👤" },
//   { path: "problems", label: "Problems", icon: "📘" },
//   { path: "feedback", label: "Feedback", icon: "💬" },
//   { path: "leaderboard", label: "Leaderboard", icon: "🏆" },
// ];
//   return (
//     <>
//       {sidebarOpen && <div style={styles.overlay} onClick={closeSidebar} />}
//       <aside
//         style={{
//           ...styles.sidebar,
//           transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
//         }}
//       >
//         <nav style={styles.nav}>
//           {menu.map((item) => (
//             <div
//               key={item.path}
//               onClick={() => {
//                 setActive(item.path);
//                 navigate(item.path);
//                 closeSidebar();
//               }}
//               style={{
//                 ...styles.navItem,
//                 background:
//                   active === item.path
//                     ? "rgba(56,189,248,0.12)"
//                     : "transparent",
//                 color: active === item.path ? "#38bdf8" : "#f1f5f9",
//               }}
//             >
//               <span style={{ marginRight: 10 }}>{item.icon}</span>
//               {item.label}
//             </div>
//           ))}
//         </nav>
//       </aside>
   
//     </>
//   );
// }

// /* ================= STYLES ================= */
// const styles = {
//   app: {
//     minHeight: "100vh",
//     background: "#0f172a",
//     color: "#f1f5f9",
//   },
//   topbar: {
//     height: 60,
//     background: "#020617",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "0 20px",
//     position: "sticky",
//     top: 0,
//     zIndex: 50,
//   },
//   logo: { fontWeight: 700 },
//   menuBtn: {
//     fontSize: 22,
//     background: "none",
//     border: "none",
//     color: "#f1f5f9",
//     cursor: "pointer",
//   },
//   logoutBtn: {
//     background: "#ef4444",
//     border: "none",
//     color: "#fff",
//     padding: "6px 14px",
//     borderRadius: 8,
//     cursor: "pointer",
//   },
//   layout: { display: "flex" },
//   sidebar: {
//     width: 240,
//     background: "#020617",
//     position: "fixed",
//     top: 60,
//     bottom: 0,
//     left: 0,
//     transition: "transform 0.3s ease",
//     zIndex: 40,
//   },
//   nav: {
//     display: "flex",
//     flexDirection: "column",
//     padding: 16,
//   },
//   navItem: {
//     padding: "12px 14px",
//     cursor: "pointer",
//     borderRadius: 10,
//     marginBottom: 6,
//     display: "flex",
//     alignItems: "center",
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//     marginLeft: 240,
//   },
//   overlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.5)",
//     zIndex: 30,
//   },
// };

// if (window.innerWidth <= 768) {
//   styles.content.marginLeft = 0;
// }


import { Routes, Route, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./AdminPannel/Dashboard";
import Users from "./pages/Users";
import Problems from "./pages/Problems";
import Feedback from "./pages/Feedback";
import Leaderboard from "./pages/Leaderboard";
import Footer from "./components/Footer";

export default function AdminDashboard() {
  return (
    <>
      <AdminLayout />
      <Footer />
    </>
  );
}

/* ================= ADMIN LAYOUT ================= */
function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const navigate = useNavigate();

  useEffect(() => {
    const onResize = () => setSidebarOpen(window.innerWidth > 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div style={styles.app}>
      {/* TOP BAR */}
      <header style={styles.topbar}>
        <button
          style={styles.menuBtn}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <h1 style={styles.logo}>DailyCode</h1>
        <button
          style={styles.logoutBtn}
          onClick={() => {
            localStorage.clear();
            navigate("/login", { replace: true });
            window.location.reload();
          }}
        >
          Logout
        </button>
      </header>

      {/* LAYOUT */}
      <div style={styles.layout}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
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
  const menu = [
    { path: ".", label: "Overview", icon: "📊" },
    { path: "users", label: "Users", icon: "👤" },
    { path: "problems", label: "Problems", icon: "📘" },
    { path: "feedback", label: "Feedback", icon: "💬" },
    { path: "leaderboard", label: "Leaderboard", icon: "🏆" },
  ];

  return (
    <>
      {sidebarOpen && <div style={styles.overlay} onClick={closeSidebar} />}

      <aside
        style={{
          ...styles.sidebar,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <nav style={styles.nav}>
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={closeSidebar}
              style={({ isActive }) => ({
                ...styles.navItem,
                background: isActive
                  ? "rgba(56,189,248,0.12)"
                  : "transparent",
                color: isActive ? "#38bdf8" : "#f1f5f9",
                textDecoration: "none",
              })}
            >
              <span style={{ marginRight: 10 }}>{item.icon}</span>
              {item.label}
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
    background: "#0f172a",
    color: "#f1f5f9",
  },
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
  logo: { fontWeight: 700 },
  menuBtn: {
    fontSize: 22,
    background: "none",
    border: "none",
    color: "#f1f5f9",
    cursor: "pointer",
  },
  logoutBtn: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "6px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },
  layout: { display: "flex" },
  sidebar: {
    width: 240,
    background: "#020617",
    position: "fixed",
    top: 60,
    bottom: 0,
    left: 0,
    transition: "transform 0.3s ease",
    zIndex: 40,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    padding: 16,
  },
  navItem: {
    padding: "12px 14px",
    cursor: "pointer",
    borderRadius: 10,
    marginBottom: 6,
    display: "flex",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 20,
    marginLeft: 240,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 30,
  },
};

if (window.innerWidth <= 768) {
  styles.content.marginLeft = 0;
}
