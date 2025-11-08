import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import { COLLEGES } from "../data/colleges";

export default function CollegeSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const fuse = useMemo(
    () =>
      new Fuse(COLLEGES, {
        keys: ["name", "city"],
        threshold: 0.3,
      }),
    []
  );

  const results = useMemo(() => {
    if (!query) return COLLEGES.slice(0, 10);
    return fuse.search(query).map((r) => r.item).slice(0, 10);
  }, [query, fuse]);

  return (
    <div style={{ position: "relative", maxWidth: 640 }}>
      <input
        className="search-input"
        placeholder="Search engineering college…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px solid #d1d5db",
          fontSize: 16,
          background: "#1f2937",
          color: "white",
        }}
      />
      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            overflow: "hidden",
            zIndex: 20,
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          {results.map((c) => (
            <button
              key={c.id}
              onMouseDown={() => onSelect(c)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 12px",
                border: "none",
                background: "white",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{c.city}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
