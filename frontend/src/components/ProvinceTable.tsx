import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from "recharts";

interface ProvinceTableProps {
  province?: { KODE_PROV: string; PROVINSI: string } | null;
}

export default function ProvinceTable({ province }: ProvinceTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const url = province
      ? `http://localhost:5000/api/revitalisasi/table/province/${province.KODE_PROV}`
      : "http://localhost:5000/api/revitalisasi/table";

    fetch(url)
      .then((res) => res.json())
      .then((rows) => {
        const safeRows = Array.isArray(rows) ? rows : [rows];
        setData(safeRows);
      })
      .catch((err) => console.error("Fetch province table error:", err));
  }, [province]);

  const formatNumber = (val: any) =>
    isNaN(Number(val)) ? "-" : Number(val).toLocaleString("id-ID");

  const formatCurrency = (val: any) =>
    isNaN(Number(val)) ? "-" : `Rp ${Number(val).toLocaleString("id-ID")}`;

  const handleRowClick = (row: any) => {
    const wilayah = province ? row.kabupaten : row.provinsi;
    setSelectedDistrict(wilayah);

    const chart = [
      { jenjang: "PAUD", sekolah: row.rev_paud, anggaran: row.anggaran_paud },
      { jenjang: "SD", sekolah: row.rev_sd, anggaran: row.anggaran_sd },
      { jenjang: "SMP", sekolah: row.rev_smp, anggaran: row.anggaran_smp },
      { jenjang: "SMA", sekolah: row.rev_sma, anggaran: row.anggaran_sma },
    ];

    setChartData(chart);
    setShowModal(true);
  };

  return (
    <div className="card h-full">
      <h3 className="font-semibold mb-2">
        {province
          ? `Tabel Revitalisasi - ${province.PROVINSI}`
          : "Tabel Revitalisasi Sekolah Nasional"}
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Jumlah sekolah & anggaran{" "}
        {province ? `di ${province.PROVINSI}` : "per provinsi"}
      </p>

      <div className="overflow-y-auto max-h-[350px] border rounded-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold border">
                {province ? "Kabupaten/Kota" : "Provinsi"}
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold border">
                Bentuk Pendidikan
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold border">
                Jumlah Sekolah
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold border">
                Anggaran
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const wilayah = province ? row.kabupaten || "-" : row.provinsi || "-";

              const jenjang = [
                { name: "PAUD", sekolah: row.rev_paud, anggaran: row.anggaran_paud },
                { name: "SD", sekolah: row.rev_sd, anggaran: row.anggaran_sd },
                { name: "SMP", sekolah: row.rev_smp, anggaran: row.anggaran_smp },
                { name: "SMA", sekolah: row.rev_sma, anggaran: row.anggaran_sma },
              ];

              return jenjang.map((j, idx) => (
                <tr
                  key={`${i}-${idx}`}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(row)}
                >
                  {idx === 0 && (
                    <td
                      rowSpan={jenjang.length}
                      className="px-4 py-2 text-sm font-semibold align-top border bg-gray-50"
                    >
                      {wilayah}
                    </td>
                  )}
                  <td className="px-4 py-2 text-sm border">{j.name}</td>
                  <td className="px-4 py-2 text-sm border text-center">
                    {formatNumber(j.sekolah)}
                  </td>
                  <td className="px-4 py-2 text-sm border whitespace-nowrap">
                    {formatCurrency(j.anggaran)}
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
  <div className="chart-modal-overlay">
    <div className="chart-modal">
      {/* Header */}
      <div className="chart-modal-header">
        <h2>Statistik Revitalisasi ({selectedDistrict})</h2>
        <button
          className="chart-modal-close"
          onClick={() => setShowModal(false)}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="chart-modal-body">
  {/* Chart 1 */}
  <div className="chart-card">
    <h3>Jumlah Revitalisasi Sekolah per Jenjang ({selectedDistrict})</h3>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="jenjang" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sekolah" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Chart 2 */}
  <div className="chart-card">
    <h3>Total Anggaran Revitalisasi per Jenjang ({selectedDistrict})</h3>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="jenjang" />
        <YAxis tickFormatter={(val) => `Rp ${val / 1e9}M`} />
        <Tooltip formatter={(val: number) => `Rp ${val.toLocaleString("id-ID")}`} />
        <Legend />
        <Bar dataKey="anggaran" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Chart 3 */}
  <div className="chart-card">
    <h3>Revitalisasi Sekolah dan Anggaran per Jenjang ({selectedDistrict})</h3>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="jenjang" />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(val) => `Rp ${val / 1e9}M`}
        />
        <Tooltip />
        <Legend />
        <Bar yAxisId="right" dataKey="anggaran" fill="#4f46e5" />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="sekolah"
          stroke="#ef4444"
          strokeWidth={2}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

    </div>
  </div>
)}

    </div>
  );
}
