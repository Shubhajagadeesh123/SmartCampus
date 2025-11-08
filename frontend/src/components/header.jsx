import { Link } from "react-router-dom";
export default function Header(){
  return (
    <header className="bg-white shadow p-3">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="font-bold">TechTitans — Smart Campus</h1>
        <nav className="space-x-4">
          <Link to="/" className="text-sm">Home</Link>
          <Link to="/map" className="text-sm font-medium">Map</Link>
        </nav>
      </div>
    </header>
  );
}
