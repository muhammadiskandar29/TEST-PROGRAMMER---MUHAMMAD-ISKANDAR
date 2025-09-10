import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
const LABELS = ["PAUD", "SD", "SMP", "SMA"];

interface BudgetChartProps {
  province?: { KODE_PROV: string; PROVINSI: string } | null;
}

export default function BudgetChart({ province }: BudgetChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const url = province
      ? `http://localhost:5000/api/revitalisasi/summary/province/${province.KODE_PROV}`
      : "http://localhost:5000/api/revitalisasi/summary";

    fetch(url)
      .then((res) => res.json())
      .then((summary) => {
        const formattedData = [
          { name: "PAUD", value: Number(summary.anggaran_paud) },
          { name: "SD", value: Number(summary.anggaran_sd) },
          { name: "SMP", value: Number(summary.anggaran_smp) },
          { name: "SMA", value: Number(summary.anggaran_sma) },
        ];
        setData(formattedData);
        setTotal(formattedData.reduce((acc, curr) => acc + curr.value, 0));
      })
      .catch((err) => console.error("Fetch summary error:", err));
  }, [province]); // 👈 ganti data kalau provinsi berubah

  return (
    <div className="card h-full">
      <h3 className="font-semibold mb-2">
        Anggaran Revitalisasi {province ? `- ${province.PROVINSI}` : ""}
      </h3>
      <p className="text-sm text-gray-500 mb-4">Distribusi anggaran</p>

      {/* Donut chart */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              dataKey="value"
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: number) => `Rp ${val.toLocaleString("id-ID")}`}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Total di tengah donat */}
        <div className="chart-center-text">
          <p className="chart-total-label">Total</p>
          <p className="chart-total-value">
            Rp {total.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Legend custom */}
      <div className="chart-legend">
        {LABELS.map((label, i) => (
          <div key={i} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: COLORS[i] }}
            />
            <span className="legend-text">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
