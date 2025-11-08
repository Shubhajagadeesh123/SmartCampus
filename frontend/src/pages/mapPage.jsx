// src/pages/mapPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import Fuse from "fuse.js";
import { POIS } from "../data/pois.js";

const DEFAULT_CENTER = [POIS[0].lat, POIS[0].lng];
const osrm = () =>
  L.Routing.osrmv1({ serviceUrl: "https://router.project-osrm.org/route/v1" });

function Routing({ start, end }) {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    if (!map || !start || !end) return;

    // Remove previous control
    if (controlRef.current) {
      map.removeControl(controlRef.current);
      controlRef.current = null;
    }

    const ctrl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      router: osrm(),
      addWaypoints: false,
      show: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    controlRef.current = ctrl;

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
    };
  }, [map, start?.[0], start?.[1], end?.[0], end?.[1]]);

  return null;
}

export default function MapPage() {
  const [userPos, setUserPos] = useState(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  // get user location
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watch = navigator.geolocation.watchPosition(
      (p) => setUserPos([p.coords.latitude, p.coords.longitude]),
      () => {},
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(POIS, {
        keys: ["name", "id", "category"],
        threshold: 0.3,
      }),
    []
  );

  const results = query ? fuse.search(query).map((r) => r.item) : POIS;

  return (
    <div className="p-4 grid gap-3 sm:grid-cols-[320px_1fr]">
      <div className="space-y-3">
        <div>
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="Search building…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <ul className="max-h-64 overflow-auto divide-y rounded border bg-white">
          {results.map((p) => (
            <li
              key={p.id}
              className={`p-2 cursor-pointer ${selected?.id === p.id ? "bg-blue-50" : ""}`}
              onClick={() => setSelected(p)}
            >
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-gray-500">
                {p.category} · {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
              </div>
            </li>
          ))}
        </ul>

        <div className="text-sm text-gray-600">
          {userPos ? (
            <>Your location: {userPos[0].toFixed(5)}, {userPos[1].toFixed(5)}</>
          ) : (
            <>Allow location to route from your position.</>
          )}
        </div>
      </div>

      <div style={{ height: "75vh" }}>
        <MapContainer center={DEFAULT_CENTER} zoom={17} style={{ height: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userPos && <Marker position={userPos} />}
          {selected && <Marker position={[selected.lat, selected.lng]} />}
          {userPos && selected && (
            <Routing start={userPos} end={[selected.lat, selected.lng]} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
