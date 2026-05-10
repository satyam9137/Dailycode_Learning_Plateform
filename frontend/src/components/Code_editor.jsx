// import { useEffect, useState } from "react";
// import api from "../api";
// import CodeEditor from "./CodeEditor";
// import LevelsSidebar from "./LevelsSidebar";

// export default function App() {
// const userId = localStorage.getItem("userId");


//   const [levels, setLevels] = useState([]);
//   const [currentLevel, setCurrentLevel] = useState(1);
//   const [level, setLevel] = useState(null);

//   const [language, setLanguage] = useState("python");

//   const [code, setCode] = useState("");
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");
//   const [error, setError] = useState("");

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   /* 🔹 Load levels sidebar */
//   useEffect(() => {
//     api.get(`/code/levels/${userId}`)
//       .then((res) => {
//         setLevels(res.data.levels);
//         setCurrentLevel(res.data.currentLevel);
//       })
//       .catch(() => setError("this is Failed api"));
//   }, []);

//   /* 🔹 Load current level */
//   useEffect(() => {
//     api
//       .get(`/level/${userId}`)
//       .then((res) => {
//         setLevel(res.data.level);
//         setCode("");
//         setInput("");
//         setOutput("");
//       })
//       .catch(() => setError("Fato load level"));
//   }, [currentLevel]);

//   if (error) return <h2 style={{ padding: 20 }}>{error}</h2>;
//   if (!level) return <h2 style={{ padding: 20 }}>Loading...</h2>;

//   return (
//     <div style={styles.page}>
//       {/* ✅ Top Navbar */}
//       <div style={styles.navbar}>
//         <button
//           style={styles.menuBtn}
//           onClick={() => setSidebarOpen((prev) => !prev)}
//         >
//           ☰
//         </button>
//         <h1 style={styles.logo}>Dailycode</h1>

//         <div style={styles.langBox}>
//           <span style={styles.langLabel}>Language:</span>
//           <select
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//             style={styles.select}
//           >
//             <option value="python">Python</option>
//             <option value="javascript">JavaScript</option>
//             <option value="c">C</option>
//             <option value="cpp">C++</option>
//           </select>
//         </div>
//       </div>

//       <div style={styles.layout}>
//         {/* ✅ SIDEBAR */}
//         <div
//           style={{
//             ...styles.sidebar,
//             ...(sidebarOpen ? styles.sidebarOpen : {}),
//           }}
//         >
//           <div style={styles.sidebarHeader}>
//             <h3 style={{ margin: 0 }}></h3>
//             <button
//               style={styles.closeBtn}
//               onClick={() => setSidebarOpen(false)}
//             >
//               ✖
//             </button>
//           </div>

//           <LevelsSidebar
//             levels={levels}
//             currentLevel={currentLevel}
//             onSelectLevel={(lvl) => {
//               if (lvl <= currentLevel) {
//                 setCurrentLevel(lvl);
//                 setSidebarOpen(false); // ✅ auto close on mobile
//               }
//             }}
//           />
//         </div>

//         {/* ✅ MAIN AREA */}
//         <div style={styles.main}>
//           {/* ✅ Problem Card */}
//           <div style={styles.card}>
//             <div style={styles.cardHeader}>
//               <h2 style={styles.title}>
//                 Level {level.level_no}: {level.title}
//               </h2>
//               <span style={styles.badge}>Unlocked ✅</span>
//             </div>
//             <p style={styles.desc}>{level.description}</p>
//           </div>

//           {/* ✅ Editor Card */}
//           <div style={styles.editorCard}>
//             <div style={styles.editorHeader}>
//               <h3 style={{ margin: 0 }}>Editor</h3>

//               <div style={styles.btnRow}>
//                 <button
//                   style={{ ...styles.btn, ...styles.runBtn }}
//                   onClick={async () => {
//                     if (!input.trim()) {
//                       alert("Input required for Run");
//                       return;
//                     }
//                     const res = await api.post("/run", {
//                       code,
//                       language,
//                       input,
//                     });
//                     setOutput(res.data.output);
//                   }}
//                 >
//                   ▶ Run
//                 </button>

//                 <button
//                   style={{ ...styles.btn, ...styles.submitBtn }}
//                   onClick={async () => {
//                     const res = await api.post("/submit", {
//                       userId,
//                       code,
//                       language,
//                     });

//                     alert(res.data.verdict);

//                     if (res.data.verdict.includes("Accepted")) {
//                       setCurrentLevel((prev) => prev + 1);
//                     }
//                   }}
//                 >
//                   ✔ Submit
//                 </button>
//               </div>
//             </div>

//             <div style={styles.editorBody}>
//               <div style={styles.editorBox}>
//                 <CodeEditor code={code} setCode={setCode} />
//               </div>
//             </div>
//           </div>

//           {/* ✅ IO Section */}
//           <div style={styles.ioGrid}>
//             {/* Input */}
//             <div style={styles.ioCard}>
//               <h4 style={styles.ioTitle}>Your Input (Run only)</h4>
//               <textarea
//                 style={styles.textarea}
//                 rows={6}
//                 value={input}
//                 placeholder="Enter your input here..."
//                 onChange={(e) => setInput(e.target.value)}
//               />
//             </div>

//             {/* Output */}
//             <div style={styles.ioCard}>
//               <h4 style={styles.ioTitle}>Your Output</h4>
//               <pre style={styles.outputBox}>
//                 {output || "Output will appear here..."}
//               </pre>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Mobile background overlay */}
//       {sidebarOpen && (
//         <div
//           style={styles.overlay}
//           onClick={() => setSidebarOpen(false)}
//         ></div>
//       )}
//     </div>
//   );
// }

// /* ✅ CSS-IN-JS Modern UI */
// const styles = {
//   page: {
//     background: "#0f172a",
//     color: "#f1f5f9",
//     minHeight: "100vh",
//     fontFamily: "Inter, sans-serif",
//   },

//   navbar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     background: "#1e293b",
//     padding: "10px 20px",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
//   },

//   menuBtn: {
//     background: "transparent",
//     color: "white",
//     border: "none",
//     fontSize: 22,
//     cursor: "pointer",
//     display: "none",
//   },

  
//   logo: { fontSize: "1.5rem",
//      fontWeight: "bold",
//       color: "#38bdf8" },

//   langBox: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     color: "#38bdf8" 
//   },

//   langLabel: {
//     fontSize: 14,
//     opacity: 0.9,
//   },

//   select: {
//     padding: "6px 10px",
//     borderRadius: 8,
//     border: "1px solid #374151",
//     background: "#1f2937",
//     color: "white",
//     outline: "none",
//     cursor: "pointer",
//   },

//   layout: {
//     display: "flex",
//     height: "calc(100vh - 60px)",
//         background: "#0f172a",
//   },

//   sidebar: {
//     width: 280,
    
//     borderRight: "1px solid #e5e7eb",
//     padding: 12,
//     overflowY: "auto",
//     background: "#0f172a",
//   },

//   sidebarHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },

//   closeBtn: {
//     border: "none",
//     background: "#f3f4f6",
//     padding: "6px 10px",
//     borderRadius: 8,
//     cursor: "pointer",
//     display: "none",
//   },

//   main: {
//     flex: 1,
//     padding: 16,
//     overflowY: "auto",
    
//   },

//   card: {
//     borderRadius: 14,
//     padding: 16,
//     boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
//     marginBottom: 14,
//       background: "#1e293b",
//   },

//   cardHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 12,
//   },

//   title: {
//     margin: 0,
//     fontSize: 18,
//     fontWeight: 700,
//     color: "#38bdf8"
//   },

//   badge: {
//     fontSize: 12,
//     background: "#dcfce7",
//     color: "#166534",
//     padding: "6px 10px",
//     borderRadius: 999,
//     fontWeight: 600,
//     whiteSpace: "nowrap",
//   },

//   desc: {
//     marginTop: 10,
//     marginBottom: 0,
//     color: "#374151",
//     lineHeight: 1.5,
//   },

//   editorCard: {
//     background: "white",
//     borderRadius: 14,
//     padding: 14,
//     boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
//     marginBottom: 14,
//   },

//   editorHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 10,
//     gap: 12,
//     flexWrap: "wrap",
//   },
//   editorBody:{
//       color: "#38bdf8" 
//   },

//   btnRow: {
//     display: "flex",
//     gap: 10,
//   },

//   btn: {
//     border: "none",
//     padding: "10px 14px",
//     borderRadius: 10,
//     cursor: "pointer",
//     fontWeight: 700,
//     transition: "0.2s",
//   },

//   runBtn: {
//     background: "#2563eb",
//     color: "white",
//   },

//   submitBtn: {
//     background: "#16a34a",
//     color: "white",
//   },

//   editorBody: {
//     borderRadius: 12,
//     overflow: "hidden",

//     border: "1px solid #0f172a",
//   },

//   editorBox: {
//     minHeight: 320,
//     background:"#0f172a",
//   },

//   ioGrid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: 14,

//   },

//   ioCard: {
//     background: "#334155",
    
//     borderRadius: 14,
//     padding: 14,
//     boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
//   },

//   ioTitle: {
//     margin: "0 0 10px 0",
//     fontSize: 14,
//     fontWeight: 700,
//     color: "#54a0c1",
//     background: "#334155",
//   },

//   textarea: {
//     width: "90%",
//     borderRadius: 12,
//     border: "1px solid #e5e7eb",
//     padding: 12,
//     outline: "none",
//     resize: "vertical",
//     fontSize: 14,
//     fontFamily: "monospace",
//       background: "#334155",
//       },

//   outputBox: {
//      flex: 1,
//     background: "#334155",
//     padding: 10,
//     borderRadius: 6,
// color: "#54a0c1",
//   },

//   overlay: {
//     position: "fixed",
//     top: 60,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: "rgba(0,0,0,0.4)",
//     zIndex: 90,
//   },

//   /* ✅ Mobile responsive styles (handled through JS by inline changes) */
//   sidebarOpen: {
//     position: "fixed",
//     top: 60,
//     left: 0,
//     height: "calc(100vh - 60px)",
//     zIndex: 200,
//     width: 280,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
//   },
// };
// import { useEffect, useState } from "react";
// import api from "../api";
// import CodeEditor from "./CodeEditor";
// import LevelsSidebar from "./LevelsSidebar";

// export default function App() {
// const userId = localStorage.getItem("userId");

//   const [levels, setLevels] = useState([]);
//   const [currentLevel, setCurrentLevel] = useState(1);
//   const [level, setLevel] = useState(null);

//   const [language, setLanguage] = useState("python");

//   const [code, setCode] = useState("");
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");
//   const [error, setError] = useState("");

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   /* 🔹 Load levels sidebar */
//   useEffect(() => {
//     api
//       .get(`/levels/${userId}`)
//       .then((res) => {
//         setLevels(res.data.levels);
//         setCurrentLevel(res.data.currentLevel);
//       })
//       .catch(() => setError("Failed to load levels"));
//   }, []);

//   /* 🔹 Load current level */
//   useEffect(() => {
//     api
//       .get(`/level/${userId}`)
//       .then((res) => {
//         setLevel(res.data.level);
//         setCode("");
//         setInput("");
//         setOutput("");
//       })
//       .catch(() => setError("Failed to load level"));
//   }, [currentLevel]);

//   if (error) return <h2 style={{ padding: 20 }}>{error}</h2>;
//   if (!level) return <h2 style={{ padding: 20 }}>Loading...</h2>;

//   return (
//     <div style={styles.page}>
//       {/* ✅ Top Navbar */}
//       <div style={styles.navbar}>
//         <button
//           style={styles.menuBtn}
//           onClick={() => setSidebarOpen((prev) => !prev)}
//         >
//           ☰
//         </button>
//         <h1 style={styles.logo}>Dailycode</h1>

//         <div style={styles.langBox}>
//           <span style={styles.langLabel}>Language:</span>
//           <select
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//             style={styles.select}
//           >
//             <option value="python">Python</option>
//             <option value="javascript">JavaScript</option>
//             <option value="c">C</option>
//             <option value="cpp">C++</option>
//           </select>
//         </div>
//       </div>

//       <div style={styles.layout}>
//         {/* ✅ SIDEBAR */}
//         <div
//           style={{
//             ...styles.sidebar,
//             ...(sidebarOpen ? styles.sidebarOpen : {}),
//           }}
//         >
//           <div style={styles.sidebarHeader}>
//             <h3 style={{ margin: 0 }}></h3>
//             <button
//               style={styles.closeBtn}
//               onClick={() => setSidebarOpen(false)}
//             >
//               ✖
//             </button>
//           </div>

//           <LevelsSidebar
//             levels={levels}
//             currentLevel={currentLevel}
//             onSelectLevel={(lvl) => {
//               if (lvl <= currentLevel) {
//                 setCurrentLevel(lvl);
//                 setSidebarOpen(false); // ✅ auto close on mobile
//               }
//             }}
//           />
//         </div>

//         {/* ✅ MAIN AREA */}
//         <div style={styles.main}>
//           {/* ✅ Problem Card */}
//           <div style={styles.card}>
//             <div style={styles.cardHeader}>
//               <h2 style={styles.title}>
//                 Level {level.level_no}: {level.title}
//               </h2>
//               <span style={styles.badge}>Unlocked ✅</span>
//             </div>
//             <p style={styles.desc}>{level.description}</p>
//           </div>

//           {/* ✅ Editor Card */}
//           <div style={styles.editorCard}>
//             <div style={styles.editorHeader}>
//               <h3 style={{ margin: 0 }}>Editor</h3>

//               <div style={styles.btnRow}>
//                 <button
//                   style={{ ...styles.btn, ...styles.runBtn }}
//                   onClick={async () => {
//                     if (!input.trim()) {
//                       alert("Input required for Run");
//                       return;
//                     }
//                     const res = await api.post("/run", {
//                       code,
//                       language,
//                       input,
//                     });
//                     setOutput(res.data.output);
//                   }}
//                 >
//                   ▶ Run
//                 </button>

//                 <button
//                   style={{ ...styles.btn, ...styles.submitBtn }}
//                   onClick={async () => {
//                     const res = await api.post("/submit", {
//                       userId,
//                       code,
//                       language,
//                     });

//                     alert(res.data.verdict);

//                     if (res.data.verdict.includes("Accepted")) {
//                       setCurrentLevel((prev) => prev + 1);
//                     }
//                   }}
//                 >
//                   ✔ Submit
//                 </button>
//               </div>
//             </div>

//             <div style={styles.editorBody}>
//               <div style={styles.editorBox}>
//                 <CodeEditor code={code} setCode={setCode} />
//               </div>
//             </div>
//           </div>

//           {/* ✅ IO Section */}
//           <div style={styles.ioGrid}>
//             {/* Input */}
//             <div style={styles.ioCard}>
//               <h4 style={styles.ioTitle}>Your Input (Run only)</h4>
//               <textarea
//                 style={styles.textarea}
//                 rows={6}
//                 value={input}
//                 placeholder="Enter your input here..."
//                 onChange={(e) => setInput(e.target.value)}
//               />
//             </div>

//             {/* Output */}
//             <div style={styles.ioCard}>
//               <h4 style={styles.ioTitle}>Your Output</h4>
//               <pre style={styles.outputBox}>
//                 {output || "Output will appear here..."}
//               </pre>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Mobile background overlay */}
//       {sidebarOpen && (
//         <div
//           style={styles.overlay}
//           onClick={() => setSidebarOpen(false)}
//         ></div>
//       )}
//     </div>
//   );
// }

// /* ✅ CSS-IN-JS Modern UI */
// const styles = {
//   page: {
//     background: "#0f172a",
//     color: "#f1f5f9",
//     minHeight: "100vh",
//     fontFamily: "Inter, sans-serif",
//   },

//   navbar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     background: "#1e293b",
//     padding: "10px 20px",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
//   },

//   menuBtn: {
//     background: "transparent",
//     color: "white",
//     border: "none",
//     fontSize: 22,
//     cursor: "pointer",
//     display: "none",
//   },

  
//   logo: { fontSize: "1.5rem",
//      fontWeight: "bold",
//       color: "#38bdf8" },

//   langBox: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     color: "#38bdf8" 
//   },

//   langLabel: {
//     fontSize: 14,
//     opacity: 0.9,
//   },

//   select: {
//     padding: "6px 10px",
//     borderRadius: 8,
//     border: "1px solid #374151",
//     background: "#1f2937",
//     color: "white",
//     outline: "none",
//     cursor: "pointer",
//   },

//   layout: {
//     display: "flex",
//     height: "calc(100vh - 60px)",
//         background: "#0f172a",
//   },

//   sidebar: {
//     width: 280,
    
//     borderRight: "1px solid #e5e7eb",
//     padding: 12,
//     overflowY: "auto",
//     background: "#0f172a",
//   },

//   sidebarHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },

//   closeBtn: {
//     border: "none",
//     background: "#f3f4f6",
//     padding: "6px 10px",
//     borderRadius: 8,
//     cursor: "pointer",
//     display: "none",
//   },

//   main: {
//     flex: 1,
//     padding: 16,
//     overflowY: "auto",
    
//   },

//   card: {
//     borderRadius: 14,
//     padding: 16,
//     boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
//     marginBottom: 14,
//       background: "#1e293b",
//   },

//   cardHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 12,
//   },

//   title: {
//     margin: 0,
//     fontSize: 18,
//     fontWeight: 700,
//     color: "#38bdf8"
//   },

//   badge: {
//     fontSize: 12,
//     background: "#dcfce7",
//     color: "#166534",
//     padding: "6px 10px",
//     borderRadius: 999,
//     fontWeight: 600,
//     whiteSpace: "nowrap",
//   },

//   desc: {
//     marginTop: 10,
//     marginBottom: 0,
//     color: "#374151",
//     lineHeight: 1.5,
//   },

//   editorCard: {
//     background: "white",
//     borderRadius: 14,
//     padding: 14,
//     boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
//     marginBottom: 14,
//   },

//   editorHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 10,
//     gap: 12,
//     flexWrap: "wrap",
//   },
//   editorBody:{
//       color: "#38bdf8" 
//   },

//   btnRow: {
//     display: "flex",
//     gap: 10,
//   },

//   btn: {
//     border: "none",
//     padding: "10px 14px",
//     borderRadius: 10,
//     cursor: "pointer",
//     fontWeight: 700,
//     transition: "0.2s",
//   },

//   runBtn: {
//     background: "#2563eb",
//     color: "white",
//   },

//   submitBtn: {
//     background: "#16a34a",
//     color: "white",
//   },

//   editorBody: {
//     borderRadius: 12,
//     overflow: "hidden",

//     border: "1px solid #0f172a",
//   },

//   editorBox: {
//     minHeight: 320,
//     background:"#0f172a",
//   },

//   ioGrid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: 14,

//   },

//   ioCard: {
//     background: "#334155",
    
//     borderRadius: 14,
//     padding: 14,
//     boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
//   },

//   ioTitle: {
//     margin: "0 0 10px 0",
//     fontSize: 14,
//     fontWeight: 700,
//     color: "#54a0c1",
//     background: "#334155",
//   },

//   textarea: {
//     width: "90%",
//     borderRadius: 12,
//     border: "1px solid #e5e7eb",
//     padding: 12,
//     outline: "none",
//     resize: "vertical",
//     fontSize: 14,
//     fontFamily: "monospace",
//       background: "#334155",
//       },

//   outputBox: {
//      flex: 1,
//     background: "#334155",
//     padding: 10,
//     borderRadius: 6,
// color: "#54a0c1",
//   },

//   overlay: {
//     position: "fixed",
//     top: 60,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: "rgba(0,0,0,0.4)",
//     zIndex: 90,
//   },

//   /* ✅ Mobile responsive styles (handled through JS by inline changes) */
//   sidebarOpen: {
//     position: "fixed",
//     top: 60,
//     left: 0,
//     height: "calc(100vh - 60px)",
//     zIndex: 200,
//     width: 280,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
//   },
// };



import { useEffect, useState } from "react";
import api from "../api";
import CodeEditor from "./CodeEditor";
import LevelsSidebar from "./LevelsSidebar";

export default function App() {
  const userId = localStorage.getItem("userId");

  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [level, setLevel] = useState(null);
  const [sampleTest, setSampleTest] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [submitResult, setSubmitResult] = useState(null);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* 🔹 Load levels sidebar */
  useEffect(() => {
    api
      .get(`/levels/${userId}`)
      .then((res) => {
        setLevels(res.data.levels);
        setCurrentLevel(res.data.currentLevel);
      })
      .catch(() => setError("Failed to load levels"));
  }, [userId]);

  /* 🔹 Load current level */
  useEffect(() => {
    api
      .get(`/level/${userId}`)
      .then((res) => {
        setLevel(res.data.level);
        setSampleTest(res.data.sampleTest);
        setCode("");
        setInput("");
        setOutput("");
      })
      .catch(() => setError("Failed to load level"));
  }, [userId, currentLevel]);

  if (error) return <h2 style={{ padding: 20 }}>{error}</h2>;
  if (!level) return <h2 style={{ padding: 20 }}>Loading...</h2>;

  return (
    <div style={styles.page}>
      {/* ✅ Top Navbar */}
      <div style={styles.navbar}>
        <button
          style={styles.menuBtn}
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          ☰
        </button>

        <h1 style={styles.logo}>Dailycode</h1>

        <div style={styles.langBox}>
          <span style={styles.langLabel}>Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={styles.select}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>

      <div style={styles.layout}>
        {/* ✅ SIDEBAR */}
        <div
          style={{
            ...styles.sidebar,
            ...(sidebarOpen ? styles.sidebarOpen : {}),
          }}
        >
          <div style={styles.sidebarHeader}>
            <h3 style={{ margin: 0 }}>Levels</h3>
            <button
              style={styles.closeBtn}
              onClick={() => setSidebarOpen(false)}
            >
              ✖
            </button>
          </div>

          <LevelsSidebar
            levels={levels}
            currentLevel={currentLevel}
            onSelectLevel={(lvl) => {
              if (lvl <= currentLevel) {
                setCurrentLevel(lvl);
                setSidebarOpen(false);
              }
            }}
          />
        </div>

        {/* ✅ MAIN AREA */}
        <div style={styles.main}>
          {/* ✅ Problem Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.title}>
                Level {level.level_no}: {level.title}
              </h2>



              <span style={styles.badge}>Unlocked ✅</span>
            </div>
            <p style={styles.desc}>{level.description}</p>
          </div>
            {level.youtube_link && (
            <a
              href={level.youtube_link}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#38bdf8" }}
            >
            ▶ Watch Explanation
            </a>
          )}
 {sampleTest && (
          <div style={styles.card}>
            <h4 style={{ color: "#38bdf8" }}>Sample Input</h4>
            <pre>{sampleTest.input_data}</pre>

            {/* <h4 style={{ color: "#38bdf8" }}>Sample Output</h4>
            <pre>{sampleTest.expected_output}</pre>

            <button
              style={styles.runBtn}
              onClick={() => setInput(sampleTest.input_data)}
            >
              Use Sample Input
            </button> */}
          </div>
        )}
          {/* ✅ Editor Card */}
          <div style={styles.editorCard}>
            <div style={styles.editorHeader}>
              <h3 style={{ margin: 0 }}>Editor</h3>

              <div style={styles.btnRow}>
                <button
                  style={{ ...styles.btn, ...styles.runBtn }}
                  onClick={async () => {
                    if (!input.trim()) {
                      alert("Input required for Run");
                      return;
                    }
                    const res = await api.post("/run", {
                      code,
                      language,
                      input,
                    });
                    setOutput(res.data.output);
                  }}
                >
                  ▶ Run
                </button>

                <button
                  style={{ ...styles.btn, ...styles.submitBtn }}
                  onClick={async () => {
                    if (!userId) {
                      alert("Please log in before submitting code.");
                      return;
                    }

                    setSubmitResult(null);

                    try {
                      const res = await api.post("/submit", {
                        userId,
                        code,
                        language,
                      });

                      if (res.data?.error) {
                        alert(res.data.error);
                        return;
                      }

                      if (res.data.verdict?.includes("Wrong Answer")) {
                        setSubmitResult({
                          verdict: res.data.verdict,
                          failed_test: res.data.failed_test,
                          input: res.data.input,
                          expected_output: res.data.expected_output,
                          actual_output: res.data.actual_output,
                          tests: res.data.tests,
                        });
                        return;
                      }

                      if (res.data.verdict?.includes("Accepted")) {
                        setSubmitResult({
                          verdict: res.data.verdict,
                          passed_tests: res.data.passed_tests,
                          next_level: res.data.next_level,
                          tests: res.data.tests,
                        });
                        setCurrentLevel((prev) => prev + 1);
                      }
                    } catch (err) {
                      console.error(err);
                      alert(
                        err.response?.data?.error ||
                          "Submission failed. Please try again."
                      );
                    }
                  }}
                >
                  ✔ Submit
                </button>
              </div>
            </div>

            <div style={styles.editorBody}>
              <div style={styles.editorBox}>
                <CodeEditor code={code} setCode={setCode} />
              </div>
            </div>
          </div>

          {/* ✅ IO Section */}
          <div style={styles.ioGrid}>
            <div style={styles.ioCard}>
              <h4 style={styles.ioTitle}>Your Input (Run only)</h4>
              <textarea
                style={styles.textarea}
                rows={6}
                value={input}
                placeholder="Enter your input here..."
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div style={styles.ioCard}>
              <h4 style={styles.ioTitle}>Your Output</h4>
              <pre style={styles.outputBox}>
                {output || "Output will appear here..."}
              </pre>
            </div>
          </div>

          {submitResult && (
            <div style={styles.submitResultCard}>
              <h4 style={styles.ioTitle}>Submission Result</h4>
              <p style={styles.resultText}>{submitResult.verdict}</p>

              {submitResult.failed_test && (
                <div style={styles.resultDetails}>
                  <p>Failed test: {submitResult.failed_test}</p>
                  <p>Input: {submitResult.input || "(none)"}</p>
                  <p>Expected: {submitResult.expected_output || "(none)"}</p>
                  <p>Actual: {submitResult.actual_output || "(none)"}</p>
                </div>
              )}

              {submitResult.passed_tests && (
                <div style={styles.resultDetails}>
                  <p>Passed tests: {submitResult.passed_tests}</p>
                  <p>Next level: {submitResult.next_level}</p>
                </div>
              )}

              {submitResult.tests && submitResult.tests.length > 0 && (
                <div style={styles.testList}>
                  <h5>Level {submitResult.current_level || currentLevel} test cases</h5>
                  {submitResult.tests.map((test, index) => (
                    <div key={test.id || index} style={styles.testItem}>
                      <strong>Test {index + 1}</strong>
                      <p>Input: {test.input || "(none)"}</p>
                      <p>Expected: {test.expected_output || "(none)"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

/* ✅ CSS-IN-JS (UNCHANGED) */
const styles = {
  page: {
    background: "#0f172a",
    color: "#f1f5f9",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#1e293b",
    padding: "10px 20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
  },
  menuBtn: {
    background: "transparent",
    color: "white",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    display: "none",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#38bdf8",
  },
  langBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#38bdf8",
  },
  langLabel: {
    fontSize: 14,
    opacity: 0.9,
  },
  select: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #374151",
    background: "#1f2937",
    color: "white",
    outline: "none",
    cursor: "pointer",
  },
  layout: {
    display: "flex",
    height: "calc(100vh - 60px)",
    background: "#0f172a",
  },
  sidebar: {
    width: 280,
    borderRight: "1px solid #e5e7eb",
    padding: 12,
    overflowY: "auto",
    background: "#0f172a",
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  closeBtn: {
    border: "none",
    background: "#f3f4f6",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
    display: "none",
  },
  main: {
    flex: 1,
    padding: 16,
    overflowY: "auto",
  },
  card: {
    borderRadius: 14,
    padding: 16,
    background: "#1e293b",
    marginBottom: 14,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#38bdf8",
  },
  badge: {
    fontSize: 12,
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 10px",
    borderRadius: 999,
  },
  desc: {
    marginTop: 10,
    color: "#374151",
  },
  editorCard: {
    background: "white",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  editorHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  btnRow: {
    display: "flex",
    gap: 10,
  },
  btn: {
    border: "none",
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
  },
  runBtn: {
    background: "#2563eb",
    color: "white",
  },
  submitBtn: {
    background: "#16a34a",
    color: "white",
  },
  editorBody: {
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #0f172a",
  },
  editorBox: {
    minHeight: 320,
    background: "#0f172a",
  },
  ioGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },
  ioCard: {
    background: "#334155",
    borderRadius: 14,
    padding: 14,
  },
  ioTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#54a0c1",
  },
  textarea: {
    width: "90%",
    borderRadius: 12,
    padding: 12,
    fontFamily: "monospace",
    background: "#334155",
    color: "white",
  },
  outputBox: {
    background: "#334155",
    padding: 10,
    borderRadius: 6,
    color: "#54a0c1",
  },
  submitResultCard: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    color: "#e2e8f0",
  },
  resultText: {
    margin: "8px 0",
    fontWeight: 700,
    color: "#f8fafc",
  },
  resultDetails: {
    background: "#1e293b",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    color: "#d1d5db",
  },
  testList: {
    marginTop: 12,
  },
  testItem: {
    background: "#334155",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    color: "#e2e8f0",
  },
  overlay: {
    position: "fixed",
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
  },
  sidebarOpen: {
    position: "fixed",
    top: 60,
    left: 0,
    height: "calc(100vh - 60px)",
    width: 280,
  },
};
