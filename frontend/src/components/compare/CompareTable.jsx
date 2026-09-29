import RiskBadge from "../ui/RiskBadge";
import { REGIONS } from "../../data/regions";

export default function CompareTable({ result, selectedId, onSelect }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="inv-table">
        <thead>
          <tr>
            <th>Region</th><th>Hazard</th><th>Vulnerability</th><th>Exposure</th><th>Risk</th><th>Class</th>
          </tr>
        </thead>
        <tbody>
          {REGIONS.map((r) => {
            const x = result.regions[r.id];
            return (
              <tr key={r.id} className={`cmp-row ${r.id === selectedId ? "sel" : ""}`} onClick={() => onSelect(r.id)}>
                <td><b>{r.name}</b></td>
                <td>{x.hazard}</td>
                <td>{x.vulnerability}</td>
                <td>{x.exposure}</td>
                <td><b>{x.risk}</b></td>
                <td><RiskBadge score={x.risk} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="note">
        Risk = 0.35 × Hazard + 0.40 × Vulnerability + 0.25 × Exposure. Prototype thresholds: 0–24 Low, 25–49 Moderate,
        50–74 High, 75–100 Very High. Not officially validated.
      </p>
    </div>
  );
}