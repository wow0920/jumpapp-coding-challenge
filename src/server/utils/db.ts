import { config } from "dotenv";
import mysql from "mysql2/promise";

config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "root",
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT ?? 3306),
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export async function insertVehicle({ vin, make, model, year }: any) {
  const [result] = await pool.execute<mysql.ResultSetHeader>(
    `INSERT INTO vin_history (vin, make, model, year) VALUES (?, ?, ?, ?)`,
    [vin, make, model, year]
  );
  return result.insertId;
}

export async function getVehicles() {
  const [result] = await pool.query(`SELECT * FROM vin_history`);
  return result;
}
