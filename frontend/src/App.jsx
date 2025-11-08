import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home.jsx";
import MapPage from "./pages/mapPage.jsx";
import Header from "./components/header.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ padding: "16px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
