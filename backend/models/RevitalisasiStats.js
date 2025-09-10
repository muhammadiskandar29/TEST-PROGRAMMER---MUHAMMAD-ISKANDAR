import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const RevitalisasiStat = sequelize.define("RevitalisasiStat", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  district_id: { type: DataTypes.INTEGER, allowNull: false },
  jml_rev_paud: { type: DataTypes.INTEGER, defaultValue: 0 },
  jml_rev_sd: { type: DataTypes.INTEGER, defaultValue: 0 },
  jml_rev_smp: { type: DataTypes.INTEGER, defaultValue: 0 },
  jml_rev_sma: { type: DataTypes.INTEGER, defaultValue: 0 },
  total_jml_rev_sekolah: { type: DataTypes.INTEGER, defaultValue: 0 },
  anggaran_rev_paud: { type: DataTypes.BIGINT, defaultValue: 0 },
  anggaran_rev_sd: { type: DataTypes.BIGINT, defaultValue: 0 },
  anggaran_rev_smp: { type: DataTypes.BIGINT, defaultValue: 0 },
  anggaran_rev_sma: { type: DataTypes.BIGINT, defaultValue: 0 },
  total_anggaran_rev: { type: DataTypes.BIGINT, defaultValue: 0 },
}, {
  tableName: "revitalisasi_stats",
  timestamps: false,
});

export default RevitalisasiStat;
