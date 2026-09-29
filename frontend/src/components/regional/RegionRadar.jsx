import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import { DRIVERS, PROFILES } from "../../data/profiles";
import { REGIONS } from "../../data/regions";

const COLORS = { odisha: "#1f5fd6", sundarbans: "#d92d20", tamilnadu: "#16a085" };

export default function RegionRadar({ selectedId }) {
  // One row per driver, one column per region
  const data = DRIVERS.map((d) => {
    const row = { driver: d.label.split(" / ")[0].replace(" weakness", "") };
    REGIONS.forEach((r) => (row[r.id] = PROFILES[r.id].drivers[d.id]));
    return row;
  });

  return (
    <div style={{ height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="68%">
          <PolarGrid />
          <PolarAngleAxis dataKey="driver" tick={{ fontSize: 10 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
          {REGIONS.map((r) => (
            <Radar
              key={r.id}
              name={r.name.split(",")[0]}
              dataKey={r.id}
              stroke={COLORS[r.id]}
              fill={COLORS[r.id]}
              fillOpacity={r.id === selectedId ? 0.35 : 0.05}
              strokeWidth={r.id === selectedId ? 3 : 1.5}
            />
          ))}
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}