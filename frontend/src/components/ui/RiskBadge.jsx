import { getRiskLevel } from "../../constants/risk";

export default function RiskBadge({ score }) {
  const level = getRiskLevel(score);
  return (
    <span className="risk-badge" style={{ background: level.color }}>
      {level.label}
    </span>
  );
}