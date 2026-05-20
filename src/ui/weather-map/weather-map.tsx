"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LayerId } from "./weather-map.constants";

const OW_TILES = (layer: string) =>
  `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`;

interface RecenterProps {
  lat: number;
  lon: number;
}

function Recenter({ lat, lon }: RecenterProps) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);
  return null;
}

interface Props {
  lat: number;
  lon: number;
  activeLayer: LayerId;
}

export function WeatherMap({ lat, lon, activeLayer }: Props) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={8}
      className="w-full h-full rounded-xl"
      zoomControl={true}
      attributionControl={false}
    >
      <Recenter lat={lat} lon={lon} />

      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      <TileLayer
        key={activeLayer}
        url={OW_TILES(activeLayer)}
        opacity={0.6}
        attribution='&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
      />
    </MapContainer>
  );
}
