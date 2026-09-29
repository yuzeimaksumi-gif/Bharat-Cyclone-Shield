export default function Header({ item, onMenu }) {
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenu} aria-label="Open menu">☰</button>
      <div className="topbar-title">
        <h2>{item.label}</h2>
        <p>Region-Specific Cyclone Impact &amp; Infrastructure Vulnerability Assessment</p>
      </div>
      <div className="topbar-badges">
        <span className="pill pill-warn">DEMO MODE · SIMULATED</span>
        <span className="pill">Source: synthetic sample data</span>
        <span className="pill">Live feed: not connected</span>
      </div>
    </header>
  );
}