import { useState } from "react";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import SummaryCard from "./components/SummaryCard";
import BudgetChart from "./components/BudgetChart";
import ProvinceTable from "./components/ProvinceTable";
import ProvinceRevitalisasiChart from "./components/BarChart"; // ✅ Import chart baru

export default function App() {
  // 🔑 State untuk provinsi terpilih
  const [selectedProvince, setSelectedProvince] = useState<{ KODE_PROV: string; PROVINSI: string } | null>(null);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar fixed di kiri */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-[203px] p-6 flex-1 flex flex-col">
        {/* Baris pertama */}
        <div className="flex gap-6 mb-6 min-h-[400px]">
          <div className="w-1/2 h-full">
            {/* ⬅️ kirim handler klik ke MapView */}
            <MapView onProvinceClick={setSelectedProvince} />
          </div>
          <div className="w-1/2 h-full">
            {/* ⬅️ kirim state provinsi ke SummaryCard */}
            <SummaryCard province={selectedProvince} />
          </div>
        </div>

        {/* Baris kedua */}
        <div className="flex gap-6 mt-6">
          <div className="w-2/3">
            {/* ⬅️ kirim state provinsi ke Table */}
            <ProvinceTable province={selectedProvince} />
          </div>
          <div className="w-1/3">
            <BudgetChart province={selectedProvince} />
          </div>
        </div>

        {/* Baris ketiga: Chart penuh */}
        <div className="mt-6">
  <ProvinceRevitalisasiChart
  kodeProvinsi={selectedProvince?.KODE_PROV}
  namaProvinsi={selectedProvince?.PROVINSI}
/>

</div>
      </main>
    </div>
  );
}
