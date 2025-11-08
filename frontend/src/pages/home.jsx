import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";

/** A compact list of Bengaluru engineering colleges (extend anytime) */
const COLLEGES_BLR = [
  { name: "R V College of Engineering, Bengaluru", query: "RVCE Bengaluru" },
  { name: "BMS College of Engineering, Bengaluru", query: "BMSCE Bengaluru" },
  { name: "PES University (Ring Road), Bengaluru", query: "PES University RR" },
  { name: "MS Ramaiah Institute of Technology, Bengaluru", query: "MSRIT Bengaluru" },
  { name: "Dayananda Sagar College of Engineering", query: "DSCE Bengaluru" },
  { name: "Bangalore Institute of Technology", query: "BIT Bengaluru" },
  { name: "JSS Academy of Technical Education, Bengaluru", query: "JSSATEB" },
  { name: "Sir M. Visvesvaraya Institute of Technology", query: "MVIT Bengaluru" },
  { name: "BNMIT Bengaluru", query: "BNMIT Bengaluru" },
  { name: "New Horizon College of Engineering", query: "NHCE Bengaluru" },
];

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const fuse = useMemo(
    () => new Fuse(COLLEGES_BLR, { keys: ["name", "query"], threshold: 0.3 }),
    []
  );

  const results = q ? fuse.search(q).map((r) => r.item) : COLLEGES_BLR;

  const selected = selectedIdx >= 0 ? results[selectedIdx] : null;

  return (
    <div className="container page" style={{ maxWidth: 980 }}>
      <h1 className="text-3xl md:text-4xl font-extrabold" style={{ marginBottom: 8 }}>
        Smart Campus Navigation
      </h1>

      {/* hero image card */}
      <div
        className="card"
        style={{
          padding: 0,
          overflow: "hidden",
          borderRadius: 16,
          border: "1px solid var(--border)",
          marginBottom: 16,
        }}
      >
        <img
          src="/images/map-hero.jpg"
          alt="Navigation hero"
          style={{ width: "100%", height: 260, objectFit: "cover" }}
        />
        <div style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            Find a college in Bengaluru and start navigating
          </div>
          <div className="hint">
            Pick your college below. Click <b>Open Navigator</b> to go to the campus routing page.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="field">
          <label className="label">Search college</label>
          <input
            className="search-input"
            placeholder="Type college name…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSelectedIdx(-1);
            }}
          />
        </div>

        <div className="field">
          <label className="label">Select from list</label>
          <select
            className="select"
            value={selectedIdx}
            onChange={(e) => setSelectedIdx(Number(e.target.value))}
          >
            <option value={-1} disabled>
              Choose a college…
            </option>
            {results.map((c, i) => (
              <option key={c.name} value={i}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="search-row" style={{ justifyContent: "flex-start" }}>
          <button
            className="btn primary"
            onClick={() => {
              if (!selected) {
                alert("Please select a college before opening the navigator.");
                return;
              }
              // Persist the user’s selection for the Navigate page
              localStorage.setItem(
                "selectedCollege",
                JSON.stringify({ name: selected.name, query: selected.query })
              );
              navigate("/navigate");
            }}
          >
            Open Navigator
          </button>

          <div className="hint" style={{ marginLeft: 12 }}>
            Choose a college, then click the button to open the navigation page.
          </div>
        </div>
      </div>
    </div>
  );
}
