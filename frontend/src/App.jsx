import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header.jsx";
import Home from "./pages/home.jsx";        // <-- lowercase, correct path
import Navigate from "./pages/navigate.jsx"; // <-- lowercase, correct path

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/navigate" element={<Navigate />} />
      </Routes>
    </BrowserRouter>
  );
}
