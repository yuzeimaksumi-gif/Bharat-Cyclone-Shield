import { CircleMarker, Tooltip, Popup } from "react-leaflet";
import { REGIONS } from "../../data/regions";
import { CATEGORIES, PROFILES } from "../../data/profiles";
import { CATEGORY_ICON } from "../../data/facilities";
import { getRiskLevel } from "../../constants/risk";

const OFFSETS = [
  [0.35, 0.10], [-0.30, 0.25], [0.15, -0.30], [-0.20, -0.15],
  [0.40, -0.05], [-0.40, -0.30], [0.05, 0.35],
];

// Renders one illustrative marker per category per region, coloured by that category's live vulnerability.
export default function FacilityLayer({ result }) {
  return REGIONS.map((r) => {
    const p = PROFILES[r.id];
    const live = result?.regions[r.id]?.cats; // [{id, vuln, catHaz}] from the risk engine, if a scenario has run
    return CATEGORIES.map((cat, i) => {
      const base = p.infra[cat.id];
      const dyn = live?.find((c) => c.id === cat.id);
      const score = dyn ? dyn.vuln : base.base;
      const level = getRiskLevel(score);
      const [dLat, dLon] = OFFSETS[i];
      const pos = [r.center[0] + dLat * 0.5, r.center[1] + dLon * 0.5];
      return (
        <CircleMarker key={`${r.id}-${cat.id}`} center={pos} radius={8}
          pathOptions={{ color: "#fff", weight: 2, fillColor: level.color, fillOpacity: 0.95 }}>
          <Tooltip>{CATEGORY_ICON[cat.id]} {cat.label} — {r.name.split(",")[0]}</Tooltip>
          <Popup>
            <strong>{CATEGORY_ICON[cat.id]} {cat.label}</strong> · {r.name}<br />
            Vulnerability: {score}/100 ({level.label}) {dyn ? "— live scenario" : "— baseline"}<br />
            <small>{base.reason}</small><br />
            <small><em>Illustrative sample marker, not a verified asset location.</em></small>
          </Popup>
        </CircleMarker>
      );
    });
  });
}