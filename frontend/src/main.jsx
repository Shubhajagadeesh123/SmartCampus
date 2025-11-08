import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./leaflet-icons-fix.js"; // keep the fix here

import "leaflet-routing-machine/dist/leaflet-routing-machine.css"; // optional: can stay

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
