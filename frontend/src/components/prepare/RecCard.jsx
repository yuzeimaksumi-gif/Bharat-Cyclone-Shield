const STYLE = {
  urgent:      { label: "Urgent",      color: "#d92d20", bg: "#fdeceb" },
  recommended: { label: "Recommended", color: "#1f5fd6", bg: "#eaf1ff" },
  routine:     { label: "Routine",     color: "#22a559", bg: "#eafaf0" },
};

export default function RecCard({ rec }) {
  const s = STYLE[rec.priority];
  return (
    <div className="rec-item" style={{ borderLeftColor: s.color }}>
      <div className="rec-head">
        <span className="rec-tag" style={{ background: s.bg, color: s.color }}>{s.label}</span>
      </div>
      <p>{rec.text}</p>
      <p className="muted small">{rec.why}</p>
    </div>
  );
}