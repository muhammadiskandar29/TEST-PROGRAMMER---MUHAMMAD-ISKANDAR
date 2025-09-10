import express from "express";
import Province from "../models/Province.js";
import District from "../models/District.js";
import RevitalisasiStat from "../models/RevitalisasiStats.js";

const router = express.Router();

// GET semua provinsi + kabupaten
router.get("/", async (req, res) => {
  try {
    const provinces = await Province.findAll({
      include: [{ model: District }]
    });
    res.json(provinces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/table", async (req, res) => {
  try {
    const rows = await RevitalisasiStat.findAll({
      attributes: [
        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("jml_rev_paud")), "rev_paud"],
        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("anggaran_rev_paud")), "anggaran_paud"],
        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("jml_rev_sd")), "rev_sd"],
        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("anggaran_rev_sd")), "anggaran_sd"],
        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("jml_rev_smp")), "rev_smp"],
        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("anggaran_rev_smp")), "anggaran_smp"],
        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("jml_rev_sma")), "rev_sma"],
        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("anggaran_rev_sma")), "anggaran_sma"],
      ],
      include: [
        {
          model: District,
          include: [{ model: Province }]
        }
      ],
      group: ["District.province_id", "District->Province.id"],
      raw: true,
    });

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
