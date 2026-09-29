// Prototype thresholds - NOT officially validated warning thresholds.
export const RISK_LEVELS = [
  { key: "low",      label: "Low",       min: 0,  color: "#22a559" },
  { key: "moderate", label: "Moderate",  min: 25, color: "#e6b800" },
  { key: "high",     label: "High",      min: 50, color: "#f08a1c" },
  { key: "veryhigh", label: "Very High", min: 75, color: "#d92d20" },
];

export function getRiskLevel(score) {
  let level = RISK_LEVELS[0];
  for (const l of RISK_LEVELS) if (score >= l.min) level = l;
  return level;
}