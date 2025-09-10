import { useEffect, useState } from "react";

interface SummaryCardProps {
  province?: { KODE_PROV: string; PROVINSI: string } | null;
}

export default function SummaryCard({ province }: SummaryCardProps) {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const url = province
      ? `http://localhost:5000/api/revitalisasi/summary/province/${province.KODE_PROV}`
      : "http://localhost:5000/api/revitalisasi/summary";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("Summary data:", data); // ✅ cek hasil
        setSummary(data);
      })
      .catch((err) => console.error("Fetch summary error:", err));
  }, [province]);

  if (!summary) return <p>Loading...</p>;

  const formatNumber = (val: any) => {
  const num = Number(val);
  return isNaN(num) ? "0" : num.toLocaleString("id-ID");
};

const formatCurrency = (val: any) => {
  const num = Number(val);
  return isNaN(num) ? "Rp 0" : `Rp ${num.toLocaleString("id-ID")}`;
};

  const data = [
    { label: "Total Revitalisasi Sekolah", value: formatNumber(summary.total_sekolah) },
    { label: "Total Anggaran Revitalisasi", value: formatCurrency(summary.total_anggaran) },
    { label: "Revitalisasi Sekolah PAUD", value: formatNumber(summary.rev_paud) },
    { label: "Anggaran Revitalisasi Sekolah PAUD", value: formatCurrency(summary.anggaran_paud) },
    { label: "Revitalisasi Sekolah SD", value: formatNumber(summary.rev_sd) },
    { label: "Anggaran Revitalisasi Sekolah SD", value: formatCurrency(summary.anggaran_sd) },
    { label: "Revitalisasi Sekolah SMP", value: formatNumber(summary.rev_smp) },
    { label: "Anggaran Revitalisasi Sekolah SMP", value: formatCurrency(summary.anggaran_smp) },
    { label: "Revitalisasi Sekolah SMA", value: formatNumber(summary.rev_sma) },
    { label: "Anggaran Revitalisasi Sekolah SMA", value: formatCurrency(summary.anggaran_sma) },
  ];

  return (
    <div className="card summary-card flex flex-col">
      <div className="card-header flex items-center justify-between border-b pb-2">
        <h2 className="font-semibold">
          {province ? `Data Ringkasan - ${province.PROVINSI}` : "Data Ringkasan - Nasional"}
        </h2>
      </div>
      <p className="card-subtitle text-sm text-gray-500 mb-4">
        Detail alokasi anggaran untuk setiap tingkat pendidikan
      </p>

      <div className="grid grid-cols-2 gap-3">
        {data.map((item, index) => (
          <div key={index} className="summary-item">
            <p className="font-medium text-gray-700">{item.label}</p>
            <p className="text-lg font-extrabold text-blue-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
