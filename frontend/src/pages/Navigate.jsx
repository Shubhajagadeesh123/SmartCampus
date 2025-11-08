// src/pages/Navigate.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import Fuse from "fuse.js";

// ⬇️ Your campus POIs (blocks, rooms, labs, etc.)
import { POIS } from "../data/jssateb.js"; // each: {id, name, lat, lng, category?, photo?}

const DEFAULT_CENTER = [POIS[0].lat, POIS[0].lng];

// Public OSRM (walking)
const osrm = () =>
  L.Routing.osrmv1({ serviceUrl: "https://router.project-osrm.org/route/v1" });

// ---------- Small helpers ----------
function fmtDistance(m) {
  if (m == null) return "";
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;
}
function fmtTime(s) {
  if (s == null) return "";
  const mins = Math.max(1, Math.round(s / 60)); // clamp to >= 1 min so it never shows 0
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h} h ${m} min`;
}
function bearing(a, b) {
  // returns degrees from point a to b
  const dy = b.lat - a.lat;
  const dx = b.lng - a.lng;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

// ---------- Voice input (Web Speech API) ----------
function MicButton({ onResult }) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript?.trim();
      if (text) onResult(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
  }, [onResult]);

  const toggle = () => {
    if (!recRef.current) {
      alert("Voice input not supported in this browser.");
      return;
    }
    if (listening) {
      recRef.current.stop();
    } else {
      setListening(true);
      recRef.current.start();
    }
  };

  return (
    <button className="btn ghost" onClick={toggle} title="Voice search">
      {listening ? "🎙️ Stop" : "🎙️ Speak"}
    </button>
  );
}

// ---------- Turn-by-turn arrows without extra plugins ----------
function useArrowMarkers(map) {
  const markersRef = useRef([]);

  const clear = () => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  };

  const draw = (latlngs) => {
    if (!map || !latlngs?.length) return;
    clear();

    const step = Math.max(8, Math.floor(latlngs.length / 30)); // place ~30 arrows max
    for (let i = step; i < latlngs.length; i += step) {
      const a = latlngs[i - 1];
      const b = latlngs[i];
      if (!a || !b) continue;
      const deg = bearing({ lat: a.lat, lng: a.lng }, { lat: b.lat, lng: b.lng });

      const icon = L.divIcon({
        className: "arrow-icon",
        html: `<div style="
          transform: rotate(${deg}deg);
          font-size:16px;
          line-height:16px;
          color:#1fb6ff;
          text-shadow: 0 0 3px rgba(0,0,0,.6);
          ">➤</div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const mk = L.marker([b.lat, b.lng], { icon });
      mk.addTo(map);
      markersRef.current.push(mk);
    }
  };

  return { draw, clear };
}

// ---------- Routing control (no default A/B markers) ----------
function RoutingControl({ start, end, onRoute, onPolyline }) {
  const map = useMap();
  const ctrlRef = useRef(null);
  const { draw, clear } = useArrowMarkers(map);

  useEffect(() => {
    if (!map || !start || !end) return;

    if (ctrlRef.current) {
      map.removeControl(ctrlRef.current);
      ctrlRef.current = null;
    }
    clear();

    const control = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      router: osrm(),
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      show: false,
      lineOptions: {
        styles: [
          // dotted “footsteps”
          { color: "#1fb6ff", weight: 6, opacity: 0.9, dashArray: "1 14", lineCap: "round" },
        ],
      },
      createMarker: () => null, // 🔒 only our two markers
    })
      .on("routesfound", (e) => {
        const route = e && e.routes && e.routes[0];
        if (!route) return;

        // total distance/time
        const totalDistance = route.summary?.totalDistance ?? 0;
        const totalTime = route.summary?.totalTime ?? 60; // clamp to >=60s so ETA never shows 0
        const steps = [];

        if (route.legs) {
          route.legs.forEach((leg) => {
            (leg.steps || []).forEach((s) => {
              const el = document.createElement("div");
              el.innerHTML = s.instruction || "";
              steps.push({
                text: el.textContent || el.innerText || "",
                distance: typeof s.distance === "number" ? s.distance : undefined,
                time: typeof s.duration === "number" ? s.duration : undefined,
              });
            });
          });
        }

        // polyline coordinates (for arrows)
        if (route.coordinates) {
          onPolyline?.(route.coordinates);
          draw(route.coordinates);
        }
        onRoute?.({ steps, totalDistance, totalTime });
      })
      .addTo(map);

    ctrlRef.current = control;

    return () => {
      if (ctrlRef.current) {
        map.removeControl(ctrlRef.current);
        ctrlRef.current = null;
      }
      clear();
    };
  }, [map, start?.[0], start?.[1], end?.[0], end?.[1]]); // keep deps simple

  return null;
}

export default function Navigate() {
  // Search & pickers (no current location involved)
  const [q, setQ] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [destId, setDestId] = useState("");

  // Routing output
  const [routeInfo, setRouteInfo] = useState({ steps: [], totalDistance: 0, totalTime: 60 });

  const fuse = useMemo(
    () => new Fuse(POIS, { keys: ["name", "id", "category"], threshold: 0.3 }),
    []
  );
  const filtered = q ? fuse.search(q).map((r) => r.item) : POIS;

  const src = filtered.find((p) => p.id === sourceId);
  const dst = filtered.find((p) => p.id === destId);

  const start = src ? [src.lat, src.lng] : null;
  const end = dst ? [dst.lat, dst.lng] : null;

  // choose “indoor” tile (OSM is still outdoor; we simulate indoor feel with high zoom + dense POIs)
  return (
    <div className="page">
      <header className="app-header">
        <div className="app-wrap">
          <h1 className="brand"></h1>

        </div>
      </header>

      <div className="container">
        {/* Search row with mic */}
        <div className="card hero">
          <h2 className="title">Find your destination</h2>
          <p className="sub">Search rooms, blocks, labs, library… (or use voice)</p>

          <div className="search-row">
            <input
              className="search-input"
              placeholder="Type block/room (e.g., CSE Block, Library, Admin)…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <MicButton
              onResult={(text) => {
                setQ(text);
              }}
            />
          </div>
        </div>

        <div className="grid two-col">
          {/* Left pane: indoor list + pickers + steps */}
          <aside className="pane card">
            <div className="field">
              <label className="label">Source</label>
              <select
                className="select"
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
              >
                <option value="">Pick source…</option>
                {filtered.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label">Destination</label>
              <select
                className="select"
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
              >
                <option value="">Pick destination…</option>
                {filtered.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="summary">
              {start && end ? (
                <>
                  Route from <b>{src?.name}</b> to <b>{dst?.name}</b>
                  <div className="mt">
                    Distance: <b>{fmtDistance(routeInfo.totalDistance)}</b> &nbsp;·&nbsp; ETA:{" "}
                    <b>{fmtTime(routeInfo.totalTime)}</b>
                  </div>
                </>
              ) : (
                <>Choose source & destination to see route and steps.</>
              )}
            </div>

            {routeInfo.steps.length > 0 && (
              <div className="steps">
                <div className="steps-title">Turn-by-turn</div>
                <ol>
                  {routeInfo.steps.map((s, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>
                      ➜ {s.text}{" "}
                      {typeof s.distance === "number" && (
                        <span className="label" style={{ marginLeft: 6 }}>
                          ~{fmtDistance(s.distance)}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </aside>

          {/* Map */}
          <main className="map-col">
            <div className="map-wrap">
              <MapContainer center={DEFAULT_CENTER} zoom={19} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Only TWO markers (start/destination) */}
                {start && (
                  <Marker position={start}>
                    <Popup>
                      <b>Start</b>
                      {src?.photo && (
                        <div style={{ marginTop: 8 }}>
                          <img src={src.photo} alt={src.name} width={180} />
                        </div>
                      )}
                    </Popup>
                  </Marker>
                )}
                {end && (
                  <Marker position={end}>
                    <Popup>
                      <b>Destination</b>
                      {dst?.photo && (
                        <div style={{ marginTop: 8 }}>
                          <img src={dst.photo} alt={dst.name} width={180} />
                        </div>
                      )}
                    </Popup>
                  </Marker>
                )}

                {start && end && (
                  <RoutingControl
                    start={start}
                    end={end}
                    onRoute={(data) => setRouteInfo(data)}
                    onPolyline={() => {}}
                  />
                )}
              </MapContainer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
