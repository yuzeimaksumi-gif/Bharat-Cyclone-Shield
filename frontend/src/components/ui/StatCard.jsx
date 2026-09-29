export default function StatCard({ label, value, hint, accent = "var(--blue)" }) {
  return (
    <div className="card stat" style={{ borderTop: `3px solid ${accent}` }}>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      {hint && <span className="stat-hint">{hint}</span>}
    </div>
  );
}