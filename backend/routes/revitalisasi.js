import express from "express";
import RevitalisasiStat from "../models/RevitalisasiStats.js";
import District from "../models/District.js";
import Province from "../models/Province.js";

const router = express.Router();

// ✅ helper langsung disini aja
const normalize = (row) => {
  const result = {};
  Object.keys(row || {}).forEach((key) => {
    const num = Number(row[key]);
    result[key] = isNaN(num) ? 0 : num;
  });
  return result;
};

// ✅ Nasional summary
router.get("/summary", async (req, res) => {
  try {
    const summary = await RevitalisasiStat.findAll({
      attributes: [
        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("total_jml_rev_sekolah")), "total_sekolah"],
        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("total_anggaran_rev")), "total_anggaran"],

        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("jml_rev_paud")), "rev_paud"],
        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("anggaran_rev_paud")), "anggaran_paud"],

        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("jml_rev_sd")), "rev_sd"],
        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("anggaran_rev_sd")), "anggaran_sd"],

        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("jml_rev_smp")), "rev_smp"],
        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("anggaran_rev_smp")), "anggaran_smp"],

        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("jml_rev_sma")), "rev_sma"],
        [RevitalisasiStat.sequelize.fn("SUM", RevitalisasiStat.sequelize.col("anggaran_rev_sma")), "anggaran_sma"],
      ],
      raw: true,
    });

    res.json(normalize(summary[0] || {}));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Summary per provinsi (pakai raw SQL biar aman)
// ✅ Summary per provinsi (pakai raw SQL biar aman)
router.get("/summary/province/:kode_prov", async (req, res) => {
  try {
    const { kode_prov } = req.params;

    const [rows] = await RevitalisasiStat.sequelize.query(
      `
      SELECT 
        COALESCE(SUM(rs.total_jml_rev_sekolah),0) AS total_sekolah,
        COALESCE(SUM(rs.total_anggaran_rev),0) AS total_anggaran,

        COALESCE(SUM(rs.jml_rev_paud),0) AS rev_paud,
        COALESCE(SUM(rs.anggaran_rev_paud),0) AS anggaran_paud,

        COALESCE(SUM(rs.jml_rev_sd),0) AS rev_sd,
        COALESCE(SUM(rs.anggaran_rev_sd),0) AS anggaran_sd,

        COALESCE(SUM(rs.jml_rev_smp),0) AS rev_smp,
        COALESCE(SUM(rs.anggaran_rev_smp),0) AS anggaran_smp,

        COALESCE(SUM(rs.jml_rev_sma),0) AS rev_sma,
        COALESCE(SUM(rs.anggaran_rev_sma),0) AS anggaran_sma
      FROM revitalisasi_stats rs
      JOIN districts d ON d.id = rs.district_id
      JOIN provinces p ON p.id = d.province_id
      WHERE p.kode_pro = :kode_prov
      `,
      {
        replacements: { kode_prov },
        type: RevitalisasiStat.sequelize.QueryTypes.SELECT,
      }
    );

    res.json(rows || {});
  } catch (err) {
    console.error("Error summary province:", err);
    res.status(500).json({ error: "Query gagal" });
  }
});

// ✅ Summary per provinsi
router.get("/summary/province/:kode_prov", async (req, res) => {
  try {
    const { kode_prov } = req.params;

    const result = await RevitalisasiStat.sequelize.query(
      `
      SELECT 
        COALESCE(SUM(rs.total_jml_rev_sekolah),0) AS total_sekolah,
        COALESCE(SUM(rs.total_anggaran_rev),0) AS total_anggaran,

        COALESCE(SUM(rs.jml_rev_paud),0) AS rev_paud,
        COALESCE(SUM(rs.anggaran_rev_paud),0) AS anggaran_paud,

        COALESCE(SUM(rs.jml_rev_sd),0) AS rev_sd,
        COALESCE(SUM(rs.anggaran_rev_sd),0) AS anggaran_sd,

        COALESCE(SUM(rs.jml_rev_smp),0) AS rev_smp,
        COALESCE(SUM(rs.anggaran_rev_smp),0) AS anggaran_smp,

        COALESCE(SUM(rs.jml_rev_sma),0) AS rev_sma,
        COALESCE(SUM(rs.anggaran_rev_sma),0) AS anggaran_sma
      FROM revitalisasi_stats rs
      JOIN districts d ON d.id = rs.district_id
      JOIN provinces p ON p.id = d.province_id
      WHERE p.kode_prov = :kode_prov
      `,
      {
        replacements: { kode_prov },
        type: RevitalisasiStat.sequelize.QueryTypes.SELECT,
      }
    );

    // result pasti array → ambil element pertama
    res.json(result[0] || {});
  } catch (err) {
    console.error("Error summary province:", err);
    res.status(500).json({ error: "Query gagal" });
  }
});
// Tabel nasional
router.get("/table", async (req, res) => {
  try {
    const result = await RevitalisasiStat.sequelize.query(
      `
      SELECT 
        p.nama_provinsi AS provinsi,
        COALESCE(SUM(rs.jml_rev_paud),0)      AS rev_paud,
        COALESCE(SUM(rs.anggaran_rev_paud),0) AS anggaran_paud,
        COALESCE(SUM(rs.jml_rev_sd),0)        AS rev_sd,
        COALESCE(SUM(rs.anggaran_rev_sd),0)   AS anggaran_sd,
        COALESCE(SUM(rs.jml_rev_smp),0)       AS rev_smp,
        COALESCE(SUM(rs.anggaran_rev_smp),0)  AS anggaran_smp,
        COALESCE(SUM(rs.jml_rev_sma),0)       AS rev_sma,
        COALESCE(SUM(rs.anggaran_rev_sma),0)  AS anggaran_sma
      FROM revitalisasi_stats rs
      JOIN districts d ON d.id = rs.district_id
      JOIN provinces p ON p.id = d.province_id
      GROUP BY p.nama_provinsi
      ORDER BY p.nama_provinsi
      `,
      { type: RevitalisasiStat.sequelize.QueryTypes.SELECT }
    );

    res.json(result);
  } catch (err) {
    console.error("Error table nasional:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/table/province/:kode_prov", async (req, res) => {
  try {
    const { kode_prov } = req.params;

    const result = await RevitalisasiStat.sequelize.query(
      `
      SELECT 
        d.nama_kabupaten AS kabupaten,
        COALESCE(SUM(rs.jml_rev_paud),0)      AS rev_paud,
        COALESCE(SUM(rs.anggaran_rev_paud),0) AS anggaran_paud,
        COALESCE(SUM(rs.jml_rev_sd),0)        AS rev_sd,
        COALESCE(SUM(rs.anggaran_rev_sd),0)   AS anggaran_sd,
        COALESCE(SUM(rs.jml_rev_smp),0)       AS rev_smp,
        COALESCE(SUM(rs.anggaran_rev_smp),0)  AS anggaran_smp,
        COALESCE(SUM(rs.jml_rev_sma),0)       AS rev_sma,
        COALESCE(SUM(rs.anggaran_rev_sma),0)  AS anggaran_sma
      FROM revitalisasi_stats rs
      JOIN districts d ON d.id = rs.district_id
      JOIN provinces p ON p.id = d.province_id
      WHERE p.kode_pro = :kode_prov
      GROUP BY d.nama_kabupaten
      ORDER BY d.nama_kabupaten
      `,
      {
        replacements: { kode_prov },
        type: RevitalisasiStat.sequelize.QueryTypes.SELECT,
      }
    );

    res.json(result);
  } catch (err) {
    console.error("Error table kabupaten:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/chart", async (req, res) => {
  try {
    const result = await RevitalisasiStat.sequelize.query(
      `
      SELECT 
        p.nama_provinsi AS provinsi,
        COALESCE(SUM(rs.jml_rev_paud),0)      AS rev_paud,
        COALESCE(SUM(rs.anggaran_rev_paud),0) AS anggaran_paud,
        COALESCE(SUM(rs.jml_rev_sd),0)        AS rev_sd,
        COALESCE(SUM(rs.anggaran_rev_sd),0)   AS anggaran_sd,
        COALESCE(SUM(rs.jml_rev_smp),0)       AS rev_smp,
        COALESCE(SUM(rs.anggaran_rev_smp),0)  AS anggaran_smp,
        COALESCE(SUM(rs.jml_rev_sma),0)       AS rev_sma,
        COALESCE(SUM(rs.anggaran_rev_sma),0)  AS anggaran_sma
      FROM revitalisasi_stats rs
      JOIN districts d ON d.id = rs.district_id
      JOIN provinces p ON p.id = d.province_id
      GROUP BY p.nama_provinsi
      ORDER BY p.nama_provinsi
      `,
      { type: RevitalisasiStat.sequelize.QueryTypes.SELECT }
    );

    res.json(result);
  } catch (err) {
    console.error("Error chart nasional:", err);
    res.status(500).json({ error: err.message });
  }
});
// 📊 Chart per provinsi → data per kabupaten/kota
router.get("/chart/province/:kode_prov", async (req, res) => {
  try {
    const { kode_prov } = req.params;

    const result = await RevitalisasiStat.sequelize.query(
      `
      SELECT 
        d.nama_kabupaten AS kabupaten,
        COALESCE(SUM(rs.jml_rev_paud),0)      AS rev_paud,
        COALESCE(SUM(rs.anggaran_rev_paud),0) AS anggaran_paud,
        COALESCE(SUM(rs.jml_rev_sd),0)        AS rev_sd,
        COALESCE(SUM(rs.anggaran_rev_sd),0)   AS anggaran_sd,
        COALESCE(SUM(rs.jml_rev_smp),0)       AS rev_smp,
        COALESCE(SUM(rs.anggaran_rev_smp),0)  AS anggaran_smp,
        COALESCE(SUM(rs.jml_rev_sma),0)       AS rev_sma,
        COALESCE(SUM(rs.anggaran_rev_sma),0)  AS anggaran_sma
      FROM revitalisasi_stats rs
      JOIN districts d ON d.id = rs.district_id
      JOIN provinces p ON p.id = d.province_id
      WHERE p.kode_pro = :kode_prov
      GROUP BY d.nama_kabupaten
      ORDER BY d.nama_kabupaten
      `,
      {
        replacements: { kode_prov },
        type: RevitalisasiStat.sequelize.QueryTypes.SELECT,
      }
    );

    // ✅ lengkap: jumlah sekolah + anggaran
    const chartData = result.map(r => ({
      name: r.kabupaten,
      PAUD: Number(r.rev_paud),
      SD: Number(r.rev_sd),
      SMP: Number(r.rev_smp),
      SMA: Number(r.rev_sma),
      anggaran_paud: Number(r.anggaran_paud),
      anggaran_sd: Number(r.anggaran_sd),
      anggaran_smp: Number(r.anggaran_smp),
      anggaran_sma: Number(r.anggaran_sma),
    }));

    res.json(chartData);
  } catch (err) {
    console.error("Error chart kabupaten:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
