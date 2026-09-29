import { CATEGORIES } from "../../data/profiles";
import RiskBadge from "../ui/RiskBadge";
import { getRiskLevel } from "../../constants/risk";

export default function InventoryTable({ infra }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="inv-table">
        <thead>
          <tr><th>Category</th><th>Sample records</th><th>Primary hazard</th><th>Baseline vulnerability</th></tr>
        </thead>
        <tbody>
          {CATEGORIES.map((cat) => {
            const i = infra[cat.id];
            return (
              <tr key={cat.id}>
                <td><b>{cat.label}</b></td>
                <td>{i.records}</td>
                <td>{i.hazard}</td>
                <td>
                  <span className="bar inline"><i style={{ width: `${i.base}%`, background: getRiskLevel(i.base).color }} /></span>
                  {i.base} <RiskBadge score={i.base} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="note">Illustrative sample records, not verified real-world assets.</p>
    </div>
  );
}