import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { REGIONS } from "../../data/regions";

const SERIES = [
  { key: "hazard", name: "Hazard (×0.35)", color: "#f59e0b" },
  { key: "vulnerability", name: "Vulnerability (×0.40)", color: "#8b5cf6" },
  { key: "exposure", name: "Exposure (×0.25)", color: "#0ea5e9" },
  { key: "risk", name: "Overall risk", color: "#1e293b" },
];

export default function CompareChart({ result }) {
  const data = REGIONS.map((r) => {
    const x = result.regions[r.id];
    return { name: r.name.split(",")[0], hazard: x.hazard, vulnerability: x.vulnerability, exposure: x.exposure, risk: x.risk };
  });

  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {SERIES.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}