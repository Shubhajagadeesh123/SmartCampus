import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import Fuse from "fuse.js";
import { POIS, DEFAULT_CENTER } from "../data/jssateb";

const osrm = () =>
  L.Routing.osrmv1({ serviceUrl: "https://router.project-osrm.org/route/v1" });

function Routing({ start, end, onRoute }) {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    if (!map || !start || !end) return;

    if (controlRef.current) {
      map.removeControl(controlRef.current);
      controlRef.current = null;
    }

    const ctrl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      router: osrm(),
      addWaypoints: false,
      show: false,
      collapsible: true,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      createMarker: (i, wp) => L.marker(wp.latLng),
    }).addTo(map);

    ctrl.on("routesfound", (e) => {
      const route = e.routes?.[0];
      const info = {
        distance: route?.summary?.totalDistance ?? 0,
        time: route?.summary?.totalTime ?? 0,
        steps: [],
      };

      // Extract turn-by-turn steps safely (avoid optional chaining assignment)
      if (route?.instructions?.length) {
        info.steps = route.instructions.map((s) => s.text || String(s));
      } else if (route?.legs?.length) {
        const steps = [];
        route.legs.forEach((leg) => {
          leg?.steps?.forEach((s) => {
            const t =
              (s.instruction && (s.instruction.text || s.instruction)) ||
              s.name ||
              "Continue";
            steps.push(String(t));
          });
        });
        info.steps = steps;
      }

      onRoute?.(info);
    });

    controlRef.current = ctrl;
    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
    };
  }, [map, start?.[0], start?.[1], end?.[0], end?.[1], onRoute]);

  return null;
}

export default function Navigate() {
  const [params] = useSearchParams();
  const initialDestText = params.get("dest") || "";

  const [userPos, setUserPos] = useState(null);
  const [src, setSrc] = useState("Current Location"); // default source
  const [dst, setDst] = useState(initialDestText);
  const [info, setInfo] = useState({ distance: 0, time: 0, steps: [] });

  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watch = navigator.geolocation.watchPosition(
      (p) => setUserPos([p.coords.latitude, p.coords.longitude]),
      () => {},
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  // Search utility for destination free text
  const fuse = useMemo(
    () => new Fuse(POIS, { keys: ["name", "id", "category"], threshold: 0.3 }),
    []
  );

  // Resolve a text value ("Library") or exact id to a POI object
  function resolvePOI(val) {
    if (!val) return null;
    const direct = POIS.find(
      (p) => p.id === val || p.name.toLowerCase() === val.toLowerCase()
    );
    if (direct) return direct;
    const hit = fuse.search(String(val)).at(0)?.item;
    return hit || null;
  }

  // Compute start/end coordinates
  const startLatLng = (() => {
    if (src === "Current Location" && userPos) return userPos;
    const s = resolvePOI(src);
    return s ? [s.lat, s.lng] : null;
  })();

  const endLatLng = (() => {
    const d = resolvePOI(dst);
    return d ? [d.lat, d.lng] : null;
  })();

  return (
    <div className="page container grid two-col">
      <aside className="pane">
        <div className="card">
          <div className="field">
            <label className="label">Source</label>
            <select className="select" value={src} onChange={(e) => setSrc(e.target.value)}>
              <option>Current Location</option>
              {POIS.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Destination</label>
            <input
              className="search-input"
              placeholder="Type or pick below…"
              value={dst}
              onChange={(e) => setDst(e.target.value)}
            />
            <select
              className="select mt"
              value={POIS.find((p) => p.name === dst)?.id || ""}
              onChange={(e) => {
                const id = e.target.value;
                const found = POIS.find((p) => p.id === id);
                setDst(found ? found.name : "");
              }}
            >
              <option value="">— Choose a place —</option>
              {POIS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="summary">
            <div><b>Distance:</b> {(info.distance / 1000).toFixed(2)} km</div>
            <div><b>ETA:</b> {Math.round(info.time / 60)} min</div>
          </div>

          <div className="steps">
            <div className="steps-title">Steps</div>
            <ol>
              {info.steps.map((s, i) => (<li key={i}>{s}</li>))}
            </ol>
          </div>
        </div>
      </aside>

      <main className="map-col">
        <div className="map-wrap">
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={17}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Markers */}
            {startLatLng && (
              <Marker position={startLatLng}>
                <Popup>Start</Popup>
              </Marker>
            )}
            {endLatLng && (
              <Marker position={endLatLng}>
                <Popup>Destination</Popup>
              </Marker>
            )}

            {/* Routing */}
            {startLatLng && endLatLng && (
              <Routing start={startLatLng} end={endLatLng} onRoute={setInfo} />
            )}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}
