import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./leaflet-icons-fix.js"; // fixes Leaflet default marker icons
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"; // routing UI CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
