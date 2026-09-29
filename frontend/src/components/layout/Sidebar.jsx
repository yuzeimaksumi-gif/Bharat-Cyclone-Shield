import { NAV_ITEMS } from "../../constants/navigation";

export default function Sidebar({ active, onSelect, open, onClose }) {
  return (
    <>
      <div className={`overlay ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-logo">🌀</div>
          <div>
            <div className="brand-name">BHARAT CYCLONE SHIELD</div>
            <div className="brand-team">Team MATRIX</div>
          </div>
        </div>

        <nav>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-btn ${active === item.id ? "active" : ""}`}
              onClick={() => { onSelect(item.id); onClose(); }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-foot">
          <strong>DEMO MODE</strong>
          <p>All scenarios and scores are simulated prototype outputs, not real forecasts.</p>
        </div>
      </aside>
    </>
  );
}