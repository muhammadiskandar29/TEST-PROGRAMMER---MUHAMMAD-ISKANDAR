import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import sequelize from "./config/db.js";
import Province from "./models/Province.js";
import District from "./models/District.js";
import RevitalisasiStat from "./models/RevitalisasiStats.js";

import provincesRoute from "./routes/provinces.js";
import districtsRoute from "./routes/districts.js";
import revitalisasiRoute from "./routes/revitalisasi.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Definisikan relasi sebelum pakai routes
Province.hasMany(District, { foreignKey: "province_id" });
District.belongsTo(Province, { foreignKey: "province_id" });

District.hasMany(RevitalisasiStat, { foreignKey: "district_id" });
RevitalisasiStat.belongsTo(District, { foreignKey: "district_id" });


// Routes
app.use("/api/provinces", provincesRoute);
app.use("/api/districts", districtsRoute);
app.use("/api/revitalisasi", revitalisasiRoute);

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL with Sequelize");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
};

startServer();
