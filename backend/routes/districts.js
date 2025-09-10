import express from "express";
import District from "../models/District.js";
import Province from "../models/Province.js";

const router = express.Router();

// GET semua kabupaten
router.get("/", async (req, res) => {
  try {
    const districts = await District.findAll({
      include: [{ model: Province }]
    });
    res.json(districts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET semua kabupaten per provinsi
router.get("/:province_id", async (req, res) => {
  try {
    const districts = await District.findAll({
      where: { province_id: req.params.province_id }
    });
    res.json(districts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
