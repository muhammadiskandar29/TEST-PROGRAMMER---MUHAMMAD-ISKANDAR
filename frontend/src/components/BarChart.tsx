import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Line,
  LabelList,
} from "recharts";

// ✅ Helper format persen
const percent = (n: number) => n.toFixed(1) + "%";

interface Props {
  kodeProvinsi?: string;
  namaProvinsi?: string;
}

export default function ProvinceRevitalisasiChart({ kodeProvinsi, namaProvinsi }: Props) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const url = !kodeProvinsi
      ? "http://localhost:5000/api/provinces/table"
      : `http://localhost:5000/api/revitalisasi/chart/province/${kodeProvinsi}`;

    fetch(url)
      .then((res) => res.json())
      .then((rows) => {
        let formatted: any[] = [];

        if (!kodeProvinsi) {
          // ✅ Nasional → provinsi
          formatted = rows.map((row: any) => {
            const sekolah =
              Number(row.rev_paud) +
              Number(row.rev_sd) +
              Number(row.rev_smp) +
              Number(row.rev_sma);
            const anggaran =
              Number(row.anggaran_paud) +
              Number(row.anggaran_sd) +
              Number(row.anggaran_smp) +
              Number(row.anggaran_sma);
            return {
              nama:
                row["Province.nama_provinsi"] ||
                row["District.Province.nama_provinsi"] ||
                "-",
              sekolah,
              anggaran,
            };
          });
        } else {
          // ✅ Per provinsi → kabupaten
          formatted = rows.map((row: any) => {
            const sekolah =
              Number(row.PAUD || 0) +
              Number(row.SD || 0) +
              Number(row.SMP || 0) +
              Number(row.SMA || 0);
            const anggaran =
              Number(row.anggaran_paud || 0) +
              Number(row.anggaran_sd || 0) +
              Number(row.anggaran_smp || 0) +
              Number(row.anggaran_sma || 0);
            return {
              nama: row.name,
              sekolah,
              anggaran,
            };
          });
        }

        // ✅ Hitung total anggaran
        const totalAnggaran = formatted.reduce((sum, d) => sum + d.anggaran, 0);

        // ✅ Tambahin persentase + label siap tampil
        formatted = formatted.map((d) => ({
          ...d,
          persen: totalAnggaran > 0 ? (d.anggaran / totalAnggaran) * 100 : 0,
          persenLabel:
            totalAnggaran > 0
              ? percent((d.anggaran / totalAnggaran) * 100)
              : "0%",
        }));

        setData(formatted);
      })
      .catch((err) => console.error("Fetch chart error:", err));
  }, [kodeProvinsi]);

  return (
    <div className="card w-[97%] mx-auto mt-10">
      <h3 className="font-semibold mb-2 text-center">
        {kodeProvinsi
          ? `Banyaknya Jumlah Revitalisasi Sekolah Berdasarkan Anggaran Revitalisasi di Seluruh Kabupaten/Kota di Provinsi ${namaProvinsi}`
          : "Banyaknya Jumlah Revitalisasi Sekolah Berdasarkan Anggaran Revitalisasi Nasional"}
      </h3>

      <ResponsiveContainer width="95%" height={450}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 24, bottom: 80, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="nama"
            angle={-45}
            textAnchor="end"
            interval="preserveStartEnd"
            height={90}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            yAxisId="left"
            label={{
              value: "Jumlah Sekolah",
              angle: -90,
              position: "insideLeft",
            }}
            tickFormatter={(v) => Number(v).toLocaleString("id-ID")}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Persentase",
              angle: -90,
              position: "insideRight",
            }}
            tickFormatter={(v) => percent(Number(v))}
          />

          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: "12px", marginTop: "10px" }}
          />

          {/* Bar Jumlah Sekolah */}
<Bar yAxisId="left" dataKey="sekolah" fill="#f97316" name="Jumlah Sekolah">
  <LabelList
    dataKey="sekolah"
    position="insideTop"   // ⬅️ taro di dalam batang, atas sedikit
    style={{ fontSize: 10, fill: "white", fontWeight: "bold" }}
  />
</Bar>


          {/* Line Persentase */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="persen"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3, stroke: "#2563eb", strokeWidth: 2, fill: "white" }}
            name="Persentase"
          >
            <LabelList
              dataKey="persenLabel"
              position="top"
              style={{ fontSize: 9, fill: "#2563eb", fontWeight: "bold" }}
            />
          </Line>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
