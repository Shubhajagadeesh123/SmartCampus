// src/components/CollegeSearch.jsx
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { COLLEGES } from "../data/colleges";

export default function CollegeSearch({ onSelect }) {
  const [q, setQ] = useState("");
  const fuse = useMemo(
    () => new Fuse(COLLEGES, { keys: ["name", "query"], threshold: 0.3 }),
    []
  );
  const results = q ? fuse.search(q).map(r => r.item) : COLLEGES;

  return (
    <div>
      <input
        className="input-primary"
        placeholder="Search college…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <select
        className="select-primary mt-2"
        onChange={(e) => {
          const idx = Number(e.target.value);
          if (!Number.isNaN(idx)) onSelect(results[idx]);
        }}
        defaultValue=""
      >
        <option value="" disabled>Select a college…</option>
        {results.map((c, i) => (
          <option key={c.name} value={i}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}
