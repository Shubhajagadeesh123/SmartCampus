import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { COLLEGES } from "../data/colleges";

export default function Home() {
  const [q, setQ] = useState("");
  const fuse = useMemo(
    () =>
      new Fuse(COLLEGES, { keys: ["name", "city"], threshold: 0.3, ignoreLocation: true }),
    []
  );

  const results = q ? fuse.search(q).map(r => r.item) : COLLEGES.slice(0, 20);

  const openInGoogle = (c) => {
    const url = c.placeId
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name)}&query_place_id=${c.placeId}`
      : `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`;
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className="home">
      <input
        className="search"
        placeholder="Search college..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="list">
        {results.map((c) => (
          <button key={c.name} className="row" onClick={() => openInGoogle(c)}>
            <div className="title">{c.name}</div>
            <div className="meta">{c.city}</div>
          </button>
        ))}
      </div>
      <p className="hint">Select a college to open in Google Maps with full details.</p>
    </div>
  );
}
