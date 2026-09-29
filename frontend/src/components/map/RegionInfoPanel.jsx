import Card from "../ui/Card";
import RiskBadge from "../ui/RiskBadge";
import { REGIONS } from "../../data/regions";

export default function RegionInfoPanel({ selectedId, onSelect }) {
  const r = REGIONS.find((x) => x.id === selectedId);
  return (
    <Card title="Assessment Regions">
      <div className="seg">
        {REGIONS.map((x) => (
          <button key={x.id} className={x.id === selectedId ? "on" : ""} onClick={() => onSelect(x.id)}>
            {x.name.split(",")[0]}
          </button>
        ))}
      </div>

      {r ? (
        <div className="region-info">
          <h4>{r.name}</h4>
          <div>
            <b style={{ fontSize: 28 }}>{r.demoScore}</b>/100 <RiskBadge score={r.demoScore} />
          </div>
          <p className="small">{r.focus}.</p>
          <div className="chips">
            {r.traits.map((t) => (
              <span key={t} className="pill">{t}</span>
            ))}
          </div>
          <p className="muted small">Placeholder score (SIMULATED). Illustrative regional profile.</p>
        </div>
      ) : (
        <p className="muted small" style={{ marginTop: 10 }}>
          Click a zone on the map or choose a region above.
        </p>
      )}
    </Card>
  );
}