// import express from "express";
// //import db from "../../db.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// import mysql from "mysql2/promise";

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "root123",       // apna password
//   database: "dailycode",
// });
// const router = express.Router();

// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password)
//     return res.status(400).json({ message: "All fields required" });

//   try {
//     const [rows] = await db.query(
//       "SELECT * FROM admins WHERE username = ?",
//       [username]
//     );

//     if (rows.length === 0)
//       return res.status(401).json({ message: "Invalid credentials" });

//     const admin = rows[0];

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch)
//       return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: admin.id, role: "admin" },
//       "SECRET_KEY",
//       { expiresIn: "1d" }
//     );

//     res.json({
//       message: "Admin login successful",
//       token,
//       admin: {
//         id: admin.id,
//         username: admin.username,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;
