// src/components/MapView.tsx
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

interface MapViewProps {
  onProvinceClick?: (province: { KODE_PROV: string; PROVINSI: string }) => void;
}

export default function MapView({ onProvinceClick }: MapViewProps) {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch("/geojson/indonesia.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Gagal load GeoJSON:", err));
  }, []);

  // style garis doang
  const borderStyle = {
    color: "black", // warna garis
    weight: 1, // ketebalan garis
    fillOpacity: 0, // transparan (tanpa warna isi)
  };

  // handle klik tiap provinsi
  const onEachProvince = (feature: any, layer: any) => {
    layer.on({
      click: () => {
        if (onProvinceClick) {
          onProvinceClick({
            KODE_PROV: feature.properties.KODE_PROV,
            PROVINSI: feature.properties.PROVINSI,
          });
        }
      },
    });
  };

  return (
    <div className="card map-card">
      <div className="card-header">
        <h2>Persebaran Program Revitalisasi Sekolah Nasional</h2>
        <button>-</button>
      </div>
      <p className="card-subtitle">
        Menampilkan distribusi program revitalisasi sekolah di seluruh provinsi
      </p>

      <div className="map-container h-[355px] w-full">
        <MapContainer center={[-2, 118]} zoom={5} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {geoData && (
            <GeoJSON data={geoData} style={borderStyle} onEachFeature={onEachProvince} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
