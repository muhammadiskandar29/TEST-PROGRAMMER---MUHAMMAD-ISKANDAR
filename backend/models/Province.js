import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Province = sequelize.define("Province", {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  kode_pro: { type: DataTypes.INTEGER },
  nama_provinsi: { type: DataTypes.STRING },
}, {
  tableName: "provinces",
  timestamps: false,
});

export default Province;
