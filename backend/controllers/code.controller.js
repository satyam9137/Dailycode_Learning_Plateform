import db from "../db.js";
import axios from "axios";

const JUDGE0_URL = "https://ce.judge0.com";
const LANG_MAP = {
  python: { lang: "python", version: "3.10.0", file: "main.py", judge0Id: 71 },
  javascript: { lang: "javascript", version: "18.15.0", file: "main.js", judge0Id: 63 },
  c: { lang: "c", version: "10.2.0", file: "main.c", judge0Id: 50 },
  cpp: { lang: "cpp", version: "10.2.0", file: "main.cpp", judge0Id: 54 },
};

/*==================Level Controller Functions==================*/

export async function getLevels(req, res) {
  try {
    const { userId } = req.params;

    // user progress
    const [[progress]] = await db.query(
      "SELECT current_level FROM user_progress WHERE user_id=?",
      [userId]
    );

    const currentLevel = progress ? progress.current_level : 1;

    // all levels
    const [levels] = await db.query(
      "SELECT level_no, title FROM levels ORDER BY level_no"
    );

    res.json({
      currentLevel,
      levels
    });
  } catch (err) {
    console.error("getLevels error:", err);
    res.status(500).json({ error: "Failed to fetch levels" });
  }
}

/* ================= RUN CODE ================= */
export async function runCode(req, res) {
  try {
    const { code, language, input } = req.body;

    const config = LANG_MAP[language];
    if (!config) {
      return res.status(400).json({ message: "Unsupported language" });
    }

      const submission = {
      source_code: code,
      language_id: config.judge0Id,
      stdin: input || "",
    };

    const piston = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      submission,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const output = [
      piston.data.stdout,
      piston.data.stderr,
      piston.data.compile_output,
      piston.data.message,
    ]
      .filter(Boolean)
      .join("\n");

    res.json({ output: output.trim() });
  } catch (err) {
    console.error("runCode error:", err);
    res.status(500).json({ error: "Code execution failed" });
  }
}

/* ================= GET CURRENT LEVEL ================= */
export async function getLevel(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const [users] = await db.query(
      "SELECT user_id FROM users WHERE user_id=?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const [rows] = await db.query(
      "SELECT current_level FROM user_progress WHERE user_id=?",
      [userId]
    );

    let currentLevel = 1;

    if (rows.length === 0) {
      await db.query(
        "INSERT INTO user_progress (user_id, current_level) VALUES (?,1)",
        [userId]
      );
    } else {
      currentLevel = rows[0].current_level;
    }

    const [levels] = await db.query(
      "SELECT id, level_no, title, description, youtube_link FROM levels WHERE level_no=?",
      [currentLevel]
    );

    const level = levels[0];
    if (!level) {
      return res.status(404).json({ error: "Level not found" });
    }

    const [sampleTests] = await db.query(
      "SELECT input_data, expected_output FROM test_cases WHERE level_id=? LIMIT 1",
      [level.id]
    );

    res.json({
      level: {
        level_no: level.level_no,
        title: level.title,
        description: level.description,
        youtube_link: level.youtube_link,
      },
      sampleTest: sampleTests[0] || null,
    });
  } catch (err) {
    console.error("getLevel error:", err);
    res.status(500).json({ error: "Failed to fetch level" });
  }
}

/* ================= SUBMIT CODE ================= */
export async function submitCode(req, res) {
  try {
    const { userId, code, language } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const [users] = await db.query(
      "SELECT user_id FROM users WHERE user_id=?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const config = LANG_MAP[language];
    if (!config) {
      return res.json({ verdict: "Unsupported language ❌" });
    }

    const [[progress]] = await db.query(
      "SELECT current_level FROM user_progress WHERE user_id=?",
      [userId]
    );

    let levelNo = 1;
    if (progress && progress.current_level) {
      levelNo = progress.current_level;
    } else {
      await db.query(
        "INSERT IGNORE INTO user_progress (user_id, current_level) VALUES (?, 1)",
        [userId]
      );
    }

    const [[levelRow]] = await db.query(
      "SELECT id FROM levels WHERE level_no = ? LIMIT 1",
      [levelNo]
    );

    if (!levelRow) {
      return res.status(400).json({ verdict: "No level found for current progress" });
    }

    const [tests] = await db.query(
      "SELECT id, input_data, expected_output FROM test_cases WHERE level_id=?",
      [levelRow.id]
    );

    if (!tests || tests.length === 0) {
      return res.status(400).json({ verdict: "No test cases found for this level" });
    }

    const normalize = (s) => (typeof s === "string" ? s.replace(/\r/g, "").trim() : "");

    const formattedTests = tests.map((test) => ({
      id: test.id,
      input: test.input_data,
      expected_output: normalize(test.expected_output),
    }));

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];

      const response = await axios.post(
        `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
        {
          source_code: code,
          language_id: config.judge0Id,
          stdin: test.input_data,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const userOutput = [
        response.data.stdout,
        response.data.stderr,
        response.data.compile_output,
        response.data.message,
      ]
        .filter(Boolean)
        .join("\n")
        .trim();

      if (normalize(userOutput) !== normalize(test.expected_output)) {
        return res.json({
          verdict: "❌ Wrong Answer",
          failed_test: i + 1,
          input: test.input_data,
          expected_output: normalize(test.expected_output),
          actual_output: normalize(userOutput),
          tests: formattedTests,
          current_level: levelNo,
        });
      }
    }

    await db.query(
      "UPDATE user_progress SET current_level = current_level + 1 WHERE user_id=?",
      [userId]
    );

    res.json({
      verdict: "✅ Accepted",
      passed_tests: tests.length,
      next_level: levelNo + 1,
      tests: formattedTests,
      current_level: levelNo,
    });
  } catch (err) {
    console.error("submitCode error:", err);
    if (process.env.NODE_ENV !== "production") {
      return res.status(500).json({ error: "Submission failed", details: err.message });
    }
    res.status(500).json({ error: "Submission failed" });
  }
}
