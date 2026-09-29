import { RISK_LEVELS } from "../../constants/risk";

export default function MapLegend({ usingGeo, scored }) {
  return (
    <div className="map-legend">
      <strong>{scored ? "Simulated risk (prototype score)" : "Placeholder risk (no scenario run)"}</strong>
      {RISK_LEVELS.map((l) => (
        <div key={l.key}><i style={{ background: l.color }} /> {l.label}</div>
      ))}
      <small>
        {usingGeo
          ? "District polygons: geoBoundaries (CC BY 4.0). Region grouping is illustrative."
          : "Fallback: illustrative circles, not real boundaries."}
      </small>
      <small>Click the map to enable scroll-zoom.</small>
    </div>
  );
}