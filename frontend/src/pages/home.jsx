import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const recognizingRef = useRef(false);

  function go() {
    const dest = q.trim();
    if (!dest) return;
    navigate(`/navigate?dest=${encodeURIComponent(dest)}`);
  }

  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input not supported on this browser.");
      return;
    }
    const recog = new SR();
    recog.lang = "en-IN";
    recognizingRef.current = true;
    recog.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript ?? "";
      if (text) setQ(text);
    };
    recog.onend = () => {
      recognizingRef.current = false;
    };
    recog.start();
  }

  return (
    <div className="page container">
      <div className="card hero">
        <h2 className="title">Smart Campus Navigation</h2>
        <p className="sub">Type or speak your destination inside JSSATEB.</p>

        <div className="search-row">
          <input
            className="search-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g., CSE Block, Library, Cafeteria…"
            onKeyDown={(e) => e.key === "Enter" && go()}
          />
          <button className="btn primary" onClick={go}>Search</button>
          <button className="btn ghost" onClick={startVoice}>🎤</button>
        </div>

        <p className="hint">Tip: You can also select source & destination on the next page.</p>
      </div>
    </div>
  );
}
