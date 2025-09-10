// src/components/MapView.tsx
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

interface MapViewProps {
  onProvinceClick?: (province: { KODE_PROV: string; PROVINSI: string }) => void;
  selectedProvince?: { KODE_PROV: string; PROVINSI: string } | null;
}

export default function MapView({ onProvinceClick, selectedProvince }: MapViewProps) {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch("/geojson/indonesia.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Gagal load GeoJSON:", err));
  }, []);

  // ✅ style default & aktif
  const borderStyle = (feature: any) => {
    const isSelected = selectedProvince?.KODE_PROV === feature.properties.KODE_PROV;
    return {
      color: "black",
      weight: 1,
      fillColor: isSelected ? "#293e5d" : "transparent",
      fillOpacity: isSelected ? 0.5 : 0,
    };
  };

  // ✅ event tiap provinsi
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
      mouseover: () => {
        if (!selectedProvince || selectedProvince.KODE_PROV !== feature.properties.KODE_PROV) {
          layer.setStyle({
            fillColor: "#999999",
            fillOpacity: 0.3,
          });
        }
      },
      mouseout: () => {
        if (!selectedProvince || selectedProvince.KODE_PROV !== feature.properties.KODE_PROV) {
          layer.setStyle({
            fillColor: "transparent",
            fillOpacity: 0,
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
            <GeoJSON
              key={selectedProvince ? selectedProvince.KODE_PROV : "default"} // ✅ trigger re-render
              data={geoData}
              style={borderStyle}
              onEachFeature={onEachProvince}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
