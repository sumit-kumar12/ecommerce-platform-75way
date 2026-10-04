"use client";
import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "/world.json";

export default function ThreatMapWidget() {
  const [markers, setMarkers] = React.useState([]);

  React.useEffect(() => {
    let active = true;
    const fetchGeo = async () => {
      try {
        const { adminRequest } = await import("../lib/api");
        const res = await adminRequest("/soc/geolocation");
        if (active && res?.markers) {
          // Normalize API response for react-simple-maps coordinates
          const formatted = res.markers.map((m, i) => {
            return {
              id: m.id || i,
              coordinates: m.coordinates, // [lng, lat]
              color: m.type === 'critical' ? '#ef4444' : m.type === 'high' ? '#f97316' : '#eab308'
            };
          });
          setMarkers(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch SOC geolocation data", err);
      }
    };
    fetchGeo();
    const interval = setInterval(fetchGeo, 10000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  return (
    <div className="relative w-full min-h-[300px] h-full flex items-center justify-center p-2">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }} width={800} height={400} style={{ width: "100%", height: "100%" }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1f2937" 
                stroke="#374151" 
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#374151", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        {/* Active Threat Markers from SOC */}
        {markers.map((marker) => (
          <Marker key={marker.id} coordinates={marker.coordinates}>
            <circle r={5} fill={marker.color} className="animate-ping opacity-75" />
            <circle r={2.5} fill={marker.color} />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
