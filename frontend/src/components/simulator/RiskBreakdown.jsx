import Card from "../ui/Card";
import RiskBadge from "../ui/RiskBadge";
import { REGIONS } from "../../data/regions";
import { CATEGORIES } from "../../data/profiles";
import { WEIGHTS } from "../../engine/risk";

const COLORS = { hazard: "#f59e0b", vuln: "#8b5cf6", exposure: "#0ea5e9" };

export default function RiskBreakdown({ result, selectedId }) {
  const region = REGIONS.find((r) => r.id === selectedId);
  if (!result || !region) {
    return (
      <Card title="Risk breakdown">
        <p className="muted small">{!result ? "Run an analysis first." : "Select a region on the map or in the list."}</p>
      </Card>
    );
  }
  const x = result.regions[selectedId];
  const rows = [
    ["hazard", "Hazard", WEIGHTS.hazard, x.hazard, `wind ${x.wind} · rain ${x.rain} · surge ${x.surge} (distance-decayed, region-weighted)`],
    ["vuln", "Infrastructure vulnerability", WEIGHTS.vuln, x.vulnerability, "average of 7 categories, each activated by its own hazard"],
    ["exposure", "Exposure", WEIGHTS.exposure, x.exposure, `base ${x.exposureBase} × activation ${x.activation}`],
  ];
  const top = [...x.cats].sort((a, b) => b.vuln - a.vuln).slice(0, 3);

  return (
    <Card title={`Risk breakdown: ${region.name}`} right={<span className="pill pill-warn">SIMULATED</span>}>
      <div className="big-score">{x.risk}<small>/100</small> <RiskBadge score={x.risk} /></div>
      <div className="stackbar tall">
        {rows.map(([k]) => <i key={k} style={{ width: `${x.parts[k]}%`, background: COLORS[k] }} />)}
      </div>

      {rows.map(([k, label, w, val, note]) => (
        <div className="bd-row" key={k}>
          <span className="dot" style={{ background: COLORS[k] }} />
          <div>
            <b>{label}</b>: {w} × {val} = <b>{x.parts[k]}</b>
            <div className="note" style={{ marginTop: 0 }}>{note}</div>
          </div>
        </div>
      ))}

      <h4 className="sub">Most vulnerable categories in this scenario</h4>
      {top.map((c) => (
        <div className="row-h" key={c.id}>
          <span>{CATEGORIES.find((k) => k.id === c.id).label}</span>
          <b>{c.vuln}/100 <span className="muted">(relevant hazard {c.catHaz})</span></b>
        </div>
      ))}
      <p className="note">
        Risk = 0.35 × Hazard + 0.40 × Vulnerability + 0.25 × Exposure. Category vulnerability = baseline × (0.25 + 0.75 × relevant hazard / 100).
        Exposure = (0.40 density + 0.35 coastal + 0.25 low elevation) × (0.2 + 0.8 × hazard / 100). Prototype rules, not validated.
      </p>
    </Card>
  );
}