import Card from "../ui/Card";
import RiskBadge from "../ui/RiskBadge";
import { REGIONS } from "../../data/regions";

const SEG = [["hazard", "#f59e0b"], ["vuln", "#8b5cf6"], ["exposure", "#0ea5e9"]];

export default function RiskResults({ result, selectedId, onSelect }) {
  if (!result) {
    return (
      <Card title="Simulated risk by region">
        <p className="muted small">Set the controls, then click "Analyze Regional Impact".</p>
      </Card>
    );
  }
  return (
    <Card title="Simulated risk by region" right={<span className="pill pill-warn">PROTOTYPE SCORE</span>}>
      {REGIONS.map((r) => {
        const x = result.regions[r.id];
        return (
          <div key={r.id} className={`hz ${r.id === selectedId ? "sel" : ""}`} onClick={() => onSelect(r.id)}>
            <div className="row-h"><b>{r.name}</b><span><b>{x.risk}</b>/100 <RiskBadge score={x.risk} /></span></div>
            <div className="stackbar">
              {SEG.map(([k, c]) => <i key={k} style={{ width: `${x.parts[k]}%`, background: c }} />)}
            </div>
            <small className="muted">Hazard {x.hazard} · Vulnerability {x.vulnerability} · Exposure {x.exposure}</small>
          </div>
        );
      })}
      <p className="note">Bar segments = points contributed by hazard (amber), vulnerability (purple), exposure (blue).
        Prototype thresholds, not validated warning levels.</p>
    </Card>
  );
}