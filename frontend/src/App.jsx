// src/App.jsx
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home.jsx";
import Navigate from "./pages/Navigate.jsx";

export default function App() {
  return (
    <>
      <header className="app-header">
        <div className="app-wrap">
          <h1 className="brand">Smart Campus Navigation</h1>
          <nav className="nav" aria-label="primary">
            <Link to="/">Home</Link>
            <Link to="/navigate">Navigate</Link>
          </nav>
        </div>
      </header>

      <div className="container page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/navigate" element={<Navigate />} />
        </Routes>
      </div>
    </>
  );
}
