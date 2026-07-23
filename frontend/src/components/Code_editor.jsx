import { useEffect, useState, useCallback } from "react";
import api from "../api";
import CodeEditor from "./CodeEditor";
import LevelsSidebar from "./LevelsSidebar";

export default function App() {
  const userId = localStorage.getItem("userId");
  const [levels, setLevels] = useState([]);

  // FIX: split "highest level unlocked" from "level currently being viewed".
  // The original code used a single `currentLevel` for both, which caused
  // fetch/submit calls to silently target the wrong level when a user
  // browsed back to review an earlier unlocked level.
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [viewingLevel, setViewingLevel] = useState(1);

  const [level, setLevel] = useState(null);
  const [sampleTest, setSampleTest] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [submitResult, setSubmitResult] = useState(null);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* 🔹 Load levels sidebar (also reusable so we can refresh after unlocking a new level) */
  const loadLevels = useCallback(() => {
    return api
      .get(`/levels/${userId}`)
      .then((res) => {
        setLevels(res.data.levels);
        setUnlockedLevel(res.data.currentLevel);
        setViewingLevel((prev) => prev ?? res.data.currentLevel);
        setError("");
      })
      .catch(() => setError("Failed to load levels"));
  }, [userId]);

  useEffect(() => {
    loadLevels();
  }, [loadLevels]);

  /* 🔹 Load the level currently being viewed (not just "the" current level) */
  const loadLevel = useCallback(() => {
    return api
      .get(`/level/${userId}`, { params: { level: viewingLevel } })
      .then((res) => {
        setLevel(res.data.level);
        setSampleTest(res.data.sampleTest);
        setCode("");
        setInput("");
        setOutput("");
        setSubmitResult(null);
        setError("");
      })
      .catch(() => setError("Failed to load level"));
  }, [userId, viewingLevel]);

  useEffect(() => {
    if (viewingLevel) loadLevel();
  }, [loadLevel, viewingLevel]);

  const handleRetry = () => {
    setError("");
    loadLevels();
    loadLevel();
  };

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h2>{error}</h2>
        <button style={{ ...styles.btn, ...styles.runBtn }} onClick={handleRetry}>
          Retry
        </button>
      </div>
    );
  }
  if (!level) return <h2 style={{ padding: 20 }}>Loading...</h2>;

  return (
    <div style={styles.page}>
      <style>{`
        @media (max-width: 900px) {
          .dc-menu-btn { display: inline-block !important; }
          .dc-close-btn { display: inline-block !important; }
          .dc-sidebar {
            position: fixed;
            top: 60px;
            left: -280px;
            height: calc(100vh - 60px);
            width: 280px;
            z-index: 40;
            transition: left 0.25s ease;
          }
          .dc-sidebar.dc-sidebar-open { left: 0; }
          .dc-navbar { flex-wrap: wrap; row-gap: 8px; }
          .dc-io-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 600px) {
          .dc-navbar { padding: 10px 12px !important; }
          .dc-logo { font-size: 1.2rem !important; }
          .dc-lang-label { display: none; }
          .dc-main { padding: 10px !important; }
          .dc-card, .dc-editor-card, .dc-io-card, .dc-submit-result-card { padding: 12px !important; }
          .dc-card-header { flex-direction: column; align-items: flex-start; gap: 8px; }
          .dc-editor-header { flex-direction: column; align-items: flex-start; gap: 10px; }
          .dc-btn-row { width: 100%; }
          .dc-btn { flex: 1; }
          .dc-editor-box { min-height: 240px !important; }
          .dc-textarea { width: 100% !important; box-sizing: border-box; }
        }
      `}</style>

      {/* ✅ Top Navbar */}
      <div className="dc-navbar" style={styles.navbar}>
        <button
          className="dc-menu-btn"
          style={styles.menuBtn}
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          ☰
        </button>

        <h1 className="dc-logo" style={styles.logo}>Dailycode</h1>

        <div style={styles.langBox}>
          <span className="dc-lang-label" style={styles.langLabel}>Language:</span>
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
          className={`dc-sidebar${sidebarOpen ? " dc-sidebar-open" : ""}`}
          style={{
            ...styles.sidebar,
            ...(sidebarOpen ? styles.sidebarOpen : {}),
          }}
        >
          <div style={styles.sidebarHeader}>
            <h3 style={{ margin: 0 }}>Levels</h3>
            <button
              className="dc-close-btn"
              style={styles.closeBtn}
              onClick={() => setSidebarOpen(false)}
            >
              ✖
            </button>
          </div>

          <LevelsSidebar
            levels={levels}
            currentLevel={unlockedLevel}
            onSelectLevel={(lvl) => {
              // FIX: gate against unlockedLevel (progress), not the level
              // currently being viewed, so users can browse any unlocked level.
              if (lvl <= unlockedLevel) {
                setViewingLevel(lvl);
                setSidebarOpen(false);
              }
            }}
          />
        </div>

        {/* ✅ MAIN AREA */}
        <div className="dc-main" style={styles.main}>
          {/* ✅ Problem Card */}
          <div className="dc-card" style={styles.card}>
            <div className="dc-card-header" style={styles.cardHeader}>
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
            <div className="dc-card" style={styles.card}>
              <h4 style={{ color: "#38bdf8" }}>Sample Input</h4>
              <pre>{sampleTest.input_data}</pre>
            </div>
          )}
          {/* ✅ Editor Card */}
          <div className="dc-editor-card" style={styles.editorCard}>
            <div className="dc-editor-header" style={styles.editorHeader}>
              <h3 style={{ margin: 0 }}>Editor</h3>

              <div className="dc-btn-row" style={styles.btnRow}>
                <button
                  className="dc-btn"
                  style={{ ...styles.btn, ...styles.runBtn }}
                  onClick={async () => {
                    if (!input.trim()) {
                      alert("Input required for Run");
                      return;
                    }
                    try {
                      const res = await api.post("/run", {
                        code,
                        language,
                        input,
                      });
                      setOutput(res.data.output);
                    } catch (err) {
                      // FIX: Run had no error handling before; a failed
                      // request just silently did nothing.
                      console.error(err);
                      alert(
                        err.response?.data?.error ||
                        "Run failed. Please try again."
                      );
                    }
                  }}
                >
                  ▶ Run
                </button>

                <button
                  className="dc-btn"
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
                        level: viewingLevel, // FIX: submit now targets the level being viewed
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
                        // FIX: trust the server's next_level instead of blindly
                        // incrementing, and only advance progress if this
                        // submission was actually for the current frontier level.
                        const next = res.data.next_level ?? viewingLevel + 1;

                        setSubmitResult({
                          verdict: res.data.verdict,
                          passed_tests: res.data.passed_tests,
                          next_level: next,
                          tests: res.data.tests,
                        });

                        if (viewingLevel >= unlockedLevel) {
                          setUnlockedLevel(next);
                          setViewingLevel(next);
                        }

                        // FIX: refresh the sidebar list so newly unlocked
                        // levels show up without a full page reload.
                        loadLevels();
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
              <div className="dc-editor-box" style={styles.editorBox}>
                <CodeEditor code={code} setCode={setCode} />
              </div>
            </div>
          </div>

          {/* ✅ IO Section */}
          <div className="dc-io-grid" style={styles.ioGrid}>
            <div className="dc-io-card" style={styles.ioCard}>
              <h4 style={styles.ioTitle}>Your Input (Run only)</h4>
              <textarea
                className="dc-textarea"
                style={styles.textarea}
                rows={6}
                value={input}
                placeholder="Enter your input here..."
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="dc-io-card" style={styles.ioCard}>
              <h4 style={styles.ioTitle}>Your Output</h4>
              <pre style={styles.outputBox}>
                {output || "Output will appear here..."}
              </pre>
            </div>
          </div>

          {submitResult && (
            <div className="dc-submit-result-card" style={styles.submitResultCard}>
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
                  <h5>Level {submitResult.current_level || viewingLevel} test cases</h5>
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

/* ✅ CSS-IN-JS (colors unchanged; only fixed the invalid gradient property below) */
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
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    borderRadius: "999px",
    // FIX: gradients must use `background`, not `backgroundColor`
    // (backgroundColor silently ignored the value, so the badge had no fill).
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 8px 20px rgba(34, 197, 94, 0.3)",
    transition: "all 0.3s ease",
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