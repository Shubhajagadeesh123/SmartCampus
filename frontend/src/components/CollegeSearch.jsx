// src/components/CollegeSearch.jsx
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
// Expect a list from ../data/colleges (or wherever you store them)
import { COLLEGES } from "../data/colleges";

export default function CollegeSearch({ onSelect }) {
  const [q, setQ] = useState("");
  const fuse = useMemo(
    () => new Fuse(COLLEGES, { keys: ["name", "query"], threshold: 0.3 }),
    []
  );
  const results = q ? fuse.search(q).map((r) => r.item) : COLLEGES;

  return (
    <div>
      <input
        className="w-full rounded border px-3 py-3"
        placeholder="Search college…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{
          background: "linear-gradient(180deg,#0c1928,#0a2033)",
          color: "var(--text, #e7f0ff)",
          borderColor: "var(--border, #23324a)",
          borderRadius: 14,
        }}
      />

      <select
        className="w-full mt-2 rounded border px-3 py-3"
        onChange={(e) => {
          const idx = Number(e.target.value);
          if (!Number.isNaN(idx)) onSelect(results[idx]);
        }}
        defaultValue=""
        style={{
          background: "linear-gradient(180deg,#0b1a2b,#092139)",
          color: "var(--text, #e7f0ff)",
          borderColor: "var(--border, #23324a)",
          borderRadius: 14,
        }}
      >
        <option value="" disabled>
          Select a college…
        </option>
        {results.map((c, i) => (
          <option key={c.name} value={i}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
