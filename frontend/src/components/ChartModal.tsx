"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
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
  LineChart,
} from "recharts";

interface ChartModalProps {
  district: { nama: string; kode: string } | null;
  onClose: () => void;
}

export default function ChartModal({ district, onClose }: ChartModalProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!district) return;

    // ganti sesuai endpoint lo
    fetch(`http://localhost:5000/api/revitalisasi/chart/district/${district.kode}`)
      .then((res) => res.json())
      .then((rows) => {
        // normalisasi data jadi array [{jenjang, sekolah, anggaran}, ...]
        const formatted = [
          { jenjang: "PAUD", sekolah: rows.rev_paud, anggaran: rows.anggaran_paud },
          { jenjang: "SD", sekolah: rows.rev_sd, anggaran: rows.anggaran_sd },
          { jenjang: "SMP", sekolah: rows.rev_smp, anggaran: rows.anggaran_smp },
          { jenjang: "SMA", sekolah: rows.rev_sma, anggaran: rows.anggaran_sma },
        ];
        setData(formatted);
      })
      .catch((err) => console.error("Fetch chart error:", err));
  }, [district]);

  if (!district) return null;

  return (
    <div className="modal-overlay" role="dialog">
      <div className="modal-box max-w-4xl">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <h2 className="modal-title">
          Statistik Revitalisasi ({district.nama})
        </h2>

        {/* Chart 1: Jumlah Revitalisasi */}
        <div className="chart-wrapper">
          <h3 className="chart-title">Jumlah Revitalisasi Sekolah per Jenjang</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jenjang" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sekolah" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Total Anggaran */}
        <div className="chart-wrapper">
          <h3 className="chart-title">Total Anggaran Revitalisasi per Jenjang</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jenjang" />
              <YAxis />
              <Tooltip formatter={(val: number) => `Rp ${val.toLocaleString("id-ID")}`} />
              <Legend />
              <Bar dataKey="anggaran" fill="#388e3c" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Gabungan */}
        <div className="chart-wrapper">
          <h3 className="chart-title">
            Revitalisasi Sekolah dan Anggaran per Jenjang
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jenjang" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="anggaran" fill="#42a5f5" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sekolah"
                stroke="#e53935"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
