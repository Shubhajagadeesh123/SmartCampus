import { useState } from "react";
import { generate } from "./llm";

export default function App() {
  const [input, setInput] = useState("Explain quantum computing in simple terms");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  async function onRun() {
    setLoading(true);
    try {
      const text = await generate(input);
      setOut(text);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 720, margin: "40px auto" }}>
      <h1>SmartCampus — Local LLM (Web)</h1>
      <textarea
        rows={4}
        style={{ width: "100%", padding: 12 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <br />
      <button onClick={onRun} disabled={loading} style={{ padding: "8px 16px" }}>
        {loading ? "Running…" : "Generate"}
      </button>
      <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: 12, marginTop: 16 }}>
        {out}
      </pre>
    </div>
  );
}
