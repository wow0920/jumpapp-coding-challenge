import express, { Request, Response } from "express";
import ViteExpress from "vite-express";
import { config } from "dotenv";
import { pool } from "./utils/db";
config();

const PORT = Number(process.env.PORT || 3000);
const app = express();
app.use(express.json());

app.get("/api/fortune", async (req: Request, res: Response) => {
  try {
    const [results] = await pool.query(`SELECT * FROM test`);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(400).send(err);
  }
});

ViteExpress.listen(app, PORT, () => console.log("Server is listening on port 3000..."));
