import RiskBadge from "../ui/RiskBadge";
import { CATEGORIES } from "../../data/profiles";
import { CATEGORY_ICON } from "../../data/facilities";
import { getRiskLevel } from "../../constants/risk";

// Simple 3-tier disruption label, derived from the vulnerability score - not a separate model.
function disruptionTier(score) {
  if (score >= 75) return { label: "Severe disruption likely", color: "#d92d20" };
  if (score >= 50) return { label: "Moderate disruption possible", color: "#f08a1c" };
  if (score >= 25) return { label: "Limited disruption expected", color: "#e6b800" };
  return { label: "Minimal disruption expected", color: "#22a559" };
}

export default function CategoryDetail({ region, infra, live, catId }) {
  if (!catId) return <p className="muted small">Choose a category above to see its detail.</p>;
  const cat = CATEGORIES.find((c) => c.id === catId);
  const c = infra[catId];
  const dyn = live?.find((x) => x.id === catId);
  const score = dyn ? dyn.vuln : c.base;
  const tier = disruptionTier(score);

  return (
    <div>
      <h4 className="sub" style={{ marginTop: 0 }}>{CATEGORY_ICON[catId]} {cat.label} — {region.name}</h4>
      <div className="big-score">{score}<small>/100</small> <RiskBadge score={score} /></div>
      {dyn ? (
        <p className="small">Live scenario value, driven by relevant hazard <b>{dyn.catHaz}</b>/100.</p>
      ) : (
        <p className="small muted">Baseline value (run a scenario on the Cyclone Impact Map for a live figure).</p>
      )}

      <div className="bd-row"><span className="dot" style={{ background: tier.color }} /><div><b>{tier.label}</b></div></div>
      <p><b>Sample records:</b> {c.records}</p>
      <p><b>Primary hazard:</b> {c.hazard}</p>
      <p><b>Why:</b> {c.reason}</p>
      <p><b>Potential service disruption:</b> {c.disruption}</p>
      <p><b>Suggested preparedness action:</b> {c.action}</p>
      <p className="note">Illustrative sample data. Not a verified asset inventory or validated disruption model.</p>
    </div>
  );
}