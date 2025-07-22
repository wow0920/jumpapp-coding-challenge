import express, { Request, Response } from "express";
import ViteExpress from "vite-express";
import { config } from "dotenv";
config();

const PORT = Number(process.env.PORT || 3000);
const app = express();
app.use(express.json());

app.get("/api/fortune", (req: Request, res: Response) => {
  try {
    res.json({ success: true });
  } catch (err) {
    res.status(400).send(err);
  }
});

ViteExpress.listen(app, PORT, () => console.log("Server is listening on port 3000..."));
