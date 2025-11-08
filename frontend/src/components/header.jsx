import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-wrap">
        <h1 className="brand">JSSATEB — Smart Campus</h1>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/navigate">Navigate</Link>
        </nav>
      </div>
    </header>
  );
}
