import Card from "../components/ui/Card";
import CompareChart from "../components/compare/CompareChart";
import CompareTable from "../components/compare/CompareTable";
import { REGIONS } from "../data/regions";

export default function CompareView({ selectedId, onSelect, sim }) {
  const { scenario, result } = sim;

  if (!result) {
    return (
      <Card title="Regional Comparison">
        <p className="muted small">
          No scenario has been analyzed yet. Go to <b>Cyclone Impact Map</b>, set the controls and click
          "Analyze Regional Impact" to compare all three regions under the same cyclone.
        </p>
      </Card>
    );
  }

  const spread = Math.max(...REGIONS.map((r) => result.regions[r.id].risk)) -
                 Math.min(...REGIONS.map((r) => result.regions[r.id].risk));

  return (
    <div className="stack">
      <Card title="Scenario analyzed" right={<span className="pill pill-warn">SIMULATED</span>}>
        <p>
          <b>{scenario.intensity}</b> intensity · landfall near <b>{scenario.landfallId}</b> ·
          {" "}{scenario.mode === "track" ? "track-based" : "same everywhere"} regional exposure.
        </p>
        <p className="muted small">
          Same cyclone inputs, applied to three different regional profiles. Score spread across regions: <b>{spread}</b> points.
        </p>
      </Card>

      <Card title="Regional risk comparison (chart)">
        <CompareChart result={result} />
      </Card>

      <Card title="Regional risk comparison (table)">
        <CompareTable result={result} selectedId={selectedId} onSelect={onSelect} />
      </Card>
    </div>
  );
}