import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.MYSQL_HOST || process.env.DB_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
  user: process.env.MYSQL_USER || process.env.DB_USER || "root",
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || "root123",
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || "dailycode",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
