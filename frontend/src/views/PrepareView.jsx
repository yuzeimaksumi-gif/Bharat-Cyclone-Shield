import Card from "../components/ui/Card";
import RecCard from "../components/prepare/RecCard";
import { REGIONS } from "../data/regions";
import { buildRecommendations } from "../engine/recommend";

export default function PrepareView({ selectedId, onSelect, sim }) {
  const id = selectedId ?? REGIONS[0].id;
  const region = REGIONS.find((r) => r.id === id);
  const regionResult = sim.result?.regions[id] ?? null;
  const recs = buildRecommendations(id, regionResult);

  return (
    <div className="stack">
      <div className="seg">
        {REGIONS.map((r) => (
          <button key={r.id} className={r.id === id ? "on" : ""} onClick={() => onSelect(r.id)}>{r.name}</button>
        ))}
      </div>

      <Card
        title={`Preparedness Recommendations — ${region.name}`}
        right={<span className="pill pill-warn">PROTOTYPE — NOT OFFICIAL GUIDANCE</span>}
      >
        {regionResult ? (
          <p className="muted small">
            Based on the current scenario ({sim.scenario.intensity}, {sim.scenario.mode === "track" ? "track-based" : "same everywhere"})
            and this region's simulated risk of <b>{regionResult.risk}/100</b>.
          </p>
        ) : (
          <p className="muted small">No scenario analyzed yet. Showing standing regional guidance only.</p>
        )}
        {recs.map((rec, i) => <RecCard key={i} rec={rec} />)}
        <p className="note">
          These are PROTOTYPE recommendations generated from illustrative data. Always follow official guidance
          from IMD, NDMA and state disaster management authorities.
        </p>
      </Card>
    </div>
  );
}