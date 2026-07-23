// import db from "../db.js";
// export const createLevelWithTestCases = async (req, res) => {
//   const { level_no, title, description, difficulty, youtube_link, testCases } = req.body;

//   if (
//     !level_no ||
//     !title ||
//     !description ||
//     !difficulty ||
//     !Array.isArray(testCases) ||
//     testCases.length === 0
//   ) {
//     return res.status(400).json({ message: "All fields required" });
//   }

//   const conn = await db.getConnection();
//   await conn.beginTransaction();

//   try {
//     //  insert level
//    const [levelResult] = await conn.query(
//   `INSERT INTO levels (level_no, title, description, youtube_link, difficulty)
//    VALUES (?, ?, ?, ?, ?)`,
//   [level_no, title, description, youtube_link, difficulty]
// );


//     const levelId = levelResult.insertId;

//     // 2️⃣ insert test cases
//     for (const tc of testCases) {
//       if (!tc.input_data || !tc.expected_output) {
//         throw new Error("Test case fields missing");
//       }

//       await conn.query(
//         `INSERT INTO test_cases (level_id, input_data, expected_output)
//          VALUES (?, ?, ?)`,
//         [levelId, tc.input_data, tc.expected_output]
//       );
//     }

//     await conn.commit();
//     res.json({ message: "✅ Level + Test cases inserted successfully" });
//   } catch (err) {
//     await conn.rollback();
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   } finally {
//     conn.release();
//   }
// };
import db from "../db.js";

export const createLevelWithTestCases = async (req, res) => {
  const {
    level_no,
    title,
    description,
    difficulty,
    youtube_link,
    testCases,
  } = req.body;

  if (
    !level_no ||
    !title ||
    !description ||
    !difficulty ||
    !Array.isArray(testCases) ||
    testCases.length === 0
  ) {
    return res.status(400).json({ message: "All fields required" });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // ✅ Insert level
    const [levelResult] = await conn.query(
      `INSERT INTO levels 
       (level_no, title, description, youtube_link, difficulty)
       VALUES (?, ?, ?, ?, ?)`,
      [level_no, title, description, youtube_link, difficulty]
    );

    const levelId = levelResult.insertId;

    // ✅ Insert test cases
    for (const tc of testCases) {
      await conn.query(
        `INSERT INTO test_cases (level_id, input_data, expected_output)
         VALUES (?, ?, ?)`,
        [levelId, tc.input_data, tc.expected_output]
      );
    }

    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    console.error("INSERT ERROR:", err);
    res.status(500).json({ message: "Insert failed" });
  } finally {
    conn.release();
  }
};
