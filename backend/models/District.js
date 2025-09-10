import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const District = sequelize.define("District", {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  kode_kab: { type: DataTypes.INTEGER },
  nama_kabupaten: { type: DataTypes.STRING },
  province_id: { type: DataTypes.INTEGER },
}, {
  tableName: "districts",
  timestamps: false,
});

export default District;
