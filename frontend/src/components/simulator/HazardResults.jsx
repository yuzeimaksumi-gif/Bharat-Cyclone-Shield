import Card from "../ui/Card";
import { REGIONS } from "../../data/regions";
import { getRiskLevel } from "../../constants/risk";

export default function HazardResults({ result, selectedId, onSelect }) {
  if (!result) {
    return (
      <Card title="Simulated hazard by region">
        <p className="muted small">Set the controls, then click "Analyze Regional Impact".</p>
      </Card>
    );
  }
  return (
    <Card title="Simulated hazard by region" right={<span className="pill">HAZARD ONLY</span>}>
      {REGIONS.map((r) => {
        const x = result.regions[r.id];
        return (
          <div key={r.id} className={`hz ${r.id === selectedId ? "sel" : ""}`} onClick={() => onSelect(r.id)}>
            <div className="row-h"><b>{r.name}</b><b>{x.hazard}/100</b></div>
            <div className="bar"><i style={{ width: `${x.hazard}%`, background: getRiskLevel(x.hazard).color }} /></div>
            <small className="muted">
              {x.distanceKm} km from track · effective wind {x.wind} · rain {x.rain} · surge {x.surge}
            </small>
          </div>
        );
      })}
      <p className="note">
        Hazard = region-weighted mix of wind, rain and surge after distance decay. Full risk (adding infrastructure
        vulnerability and exposure) arrives in Phase 7. Illustrative simulation, not a forecast.
      </p>
    </Card>
  );
}