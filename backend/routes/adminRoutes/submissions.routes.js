import express from "express";
import db from "../../db.js";


const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.name AS user_name,
        p.title AS problem_title,
        s.status,
        s.language
      FROM submissions s
      JOIN users u ON u.id = s.user_id
      JOIN problems p ON p.id = s.problem_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
