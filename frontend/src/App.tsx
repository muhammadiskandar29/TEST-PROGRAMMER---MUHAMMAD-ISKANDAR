import { useState } from "react";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import SummaryCard from "./components/SummaryCard";
import BudgetChart from "./components/BudgetChart";
import ProvinceTable from "./components/ProvinceTable";
import ProvinceRevitalisasiChart from "./components/BarChart"; // ✅ Import chart baru
import { FilterX } from "lucide-react";


export default function App() {
  const [selectedProvince, setSelectedProvince] = useState<{ KODE_PROV: string; PROVINSI: string } | null>(null);

  return (
    <div className="flex bg-gray-100 min-h-screen relative">
      {/* Sidebar fixed di kiri */}
      <Sidebar />

      {selectedProvince && (
  <div className="province-banner">
    <p>Provinsi Terpilih:</p>
    <p>{selectedProvince.PROVINSI}</p>
    <button onClick={() => setSelectedProvince(null)} className="flex items-center gap-2">
      <FilterX size={16} />
         Reset Filter
    </button>
  </div>
)}


      {/* Main Content */}
      <main className="ml-[203px] p-6 flex-1 flex flex-col">
        {/* Baris pertama */}
        <div className="flex gap-6 mb-6 min-h-[400px]">
          <div className="w-1/2 h-full">
            <MapView onProvinceClick={setSelectedProvince} />
          </div>
          <div className="w-1/2 h-full">
            <SummaryCard province={selectedProvince} />
          </div>
        </div>

        {/* Baris kedua */}
        <div className="flex gap-6 mt-6">
          <div className="w-2/3">
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
