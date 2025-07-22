import { Router } from "express";
import { getVehicles, insertVehicle, pool } from "../utils/db";

const router = Router();

router.post("/vin", async (req, res) => {
  try {
    const newId = await insertVehicle(req.body);
    res.json({ success: true, id: newId });
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e instanceof Error ? e?.message : "Unknown",
    });
  }
});

router.get("/vin", async (req, res) => {
  try {
    res.json(await getVehicles());
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e instanceof Error ? e?.message : "Unknown",
    });
  }
});

export default router;
