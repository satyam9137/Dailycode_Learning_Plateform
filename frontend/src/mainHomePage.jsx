import axios from "axios";
import db from "../db.js";

/* ================= GET LEVEL LIST ================= */
export async function getLevels(req, res) {
  const { userId } = req.params;

  const [[p]] = await db.query(
    "SELECT current_level FROM user_progress WHERE user_id=?",
    [userId]
  );

  const [levels] = await db.query(
    "SELECT level_no,title FROM levels ORDER BY level_no"
  );

  res.json({
    levels,
    currentLevel: p.current_level
  });
}

/* ================= GET CURRENT LEVEL ================= */
export async function getCurrentLevel(req, res) {
  const { userId } = req.params;

  const [[p]] = await db.query(
    "SELECT current_level FROM user_progress WHERE user_id=?",
    [userId]
  );

  const [[level]] = await db.query(
    "SELECT * FROM levels WHERE level_no=?",
    [p.current_level]
  );

  res.json({
    level,
    expectedOutput: level.expected_output
  });
}

/* ================= GET LEVEL BY NUMBER (FIX) ================= */
export async function getLevelByNumber(req, res) {
  const { userId, levelNo } = req.params;

  const [[progress]] = await db.query(
    "SELECT current_level FROM user_progress WHERE user_id=?",
    [userId]
  );

  // 🔒 Locked level check
  if (Number(levelNo) > progress.current_level) {
    return res.status(403).json({ message: "Level Locked" });
  }

  const [[level]] = await db.query(
    "SELECT * FROM levels WHERE level_no=?",
    [levelNo]
  );

  res.json({
    level,
    expectedOutput: level.expected_output
  });
}

/* ================= RUN CODE ================= */
export async function runCode(req, res) {
  const { code, language, stdin, userId } = req.body;

  const [[p]] = await db.query(
    "SELECT current_level FROM user_progress WHERE user_id=?",
    [userId]
  );

  const [[level]] = await db.query(
    "SELECT * FROM levels WHERE level_no=?",
    [p.current_level]
  );

  const expectedOutput = level.expected_output.trim();
  const finalInput = stdin?.trim() || level.input_data;

  const langMap = {
    python: { lang: "python", version: "3.10.0", file: "main.py" },
    javascript: { lang: "javascript", version: "18.15.0", file: "main.js" }
  };

  const piston = await axios.post(
    "https://emkc.org/api/v2/piston/execute",
    {
      language: langMap[language].lang,
      version: langMap[language].version,
      files: [{ name: langMap[language].file, content: code }],
      stdin: finalInput + "\n"
    }
  );

  const run = piston.data.run;
  const userOutput =
    ((run.stdout || "") + (run.stderr || "")).trim();

  let success = false;

  if (userOutput === expectedOutput) {
    success = true;

    await db.query(
      "UPDATE user_progress SET current_level=current_level+1 WHERE user_id=?",
      [userId]
    );
  }

  res.json({ userOutput, expectedOutput, success });
}
