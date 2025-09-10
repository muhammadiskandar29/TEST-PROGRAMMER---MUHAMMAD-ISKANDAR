import { useEffect, useState } from "react";

interface ProvinceTableProps {
  province?: { KODE_PROV: string; PROVINSI: string } | null;
}

export default function ProvinceTable({ province }: ProvinceTableProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const url = province
      ? `http://localhost:5000/api/revitalisasi/table/province/${province.KODE_PROV}`
      : "http://localhost:5000/api/revitalisasi/table"; // ✅ perbaikan endpoint

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
              const wilayah = province
                ? row.kabupaten || "-"
                : row.provinsi || "-"; // ✅ pakai lowercase sesuai backend

              const jenjang = [
                { name: "PAUD", sekolah: row.rev_paud, anggaran: row.anggaran_paud },
                { name: "SD", sekolah: row.rev_sd, anggaran: row.anggaran_sd },
                { name: "SMP", sekolah: row.rev_smp, anggaran: row.anggaran_smp },
                { name: "SMA", sekolah: row.rev_sma, anggaran: row.anggaran_sma },
              ];

              return jenjang.map((j, idx) => (
                <tr key={`${i}-${idx}`} className="hover:bg-gray-50">
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
    </div>
  );
}
