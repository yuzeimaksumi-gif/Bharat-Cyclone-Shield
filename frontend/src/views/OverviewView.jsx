import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import RiskBadge from "../components/ui/RiskBadge";
import IndiaMap from "../components/map/IndiaMap";
import RiskBreakdown from "../components/simulator/RiskBreakdown";
import { REGIONS } from "../data/regions";
import { DEFAULT_LAYER_STATE } from "../constants/layers";
import LiveCycloneWatch from "../components/live/LiveCycloneWatch";

export default function OverviewView({ selectedId, onSelect, sim }) {
  const score = (r) => sim.result?.regions[r.id]?.risk ?? r.demoScore;
  const avg = Math.round(REGIONS.reduce((s, r) => s + score(r), 0) / REGIONS.length);
  const top = REGIONS.reduce((a, b) => (score(b) > score(a) ? b : a));

  return (
    <div className="stack">
      <LiveCycloneWatch />
      <div className="grid stats">
        <StatCard label="Demo regions" value={REGIONS.length} hint="Illustrative profiles" />
        <StatCard label="Avg. risk score" value={avg} hint={sim.result ? "SIMULATED scenario" : "Placeholder (no scenario)"} accent="var(--orange)" />
        <StatCard label="Highest-risk region" value={top.name.split(",")[0]} hint={sim.result ? "SIMULATED scenario" : "Placeholder"} accent="var(--red)" />
        <StatCard label="Active scenario" value={sim.scenario ? sim.scenario.intensity : "None"}
          hint={sim.scenario ? "SIMULATED · run on Map view" : "Run one on the Map view"} accent="var(--green)" />
      </div>

      <div className="grid overview-main">
        <Card title="Interactive GIS Map" right={<span className="pill pill-warn">District-based · SIMULATED risk</span>}>
          <IndiaMap selectedId={selectedId} onSelect={onSelect} layers={DEFAULT_LAYER_STATE} height={480}
            scenario={sim.scenario} result={sim.result} />
        </Card>

        <div className="stack">
          <Card title={sim.result ? "Regional risk (SIMULATED scenario)" : "Regional risk (DEMO placeholders)"}>
            {REGIONS.map((r) => (
              <div className={`region-row clickable ${r.id === selectedId ? "sel" : ""}`} key={r.id} onClick={() => onSelect(r.id)}>
                <span>{r.name}</span>
                <span><b>{score(r)}</b> <RiskBadge score={score(r)} /></span>
              </div>
            ))}
            <p className="muted small">Prototype thresholds, not official warning levels.</p>
          </Card>
          <RiskBreakdown result={sim.result} selectedId={selectedId} />
        </div>
      </div>
    </div>
  );
}