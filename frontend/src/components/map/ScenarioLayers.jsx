import { Circle, CircleMarker, Polyline, Tooltip } from "react-leaflet";

// Illustrative footprints: circles around the landfall point, sized by intensity and slider values.
// NOT a physical wind/rain/surge model or forecast.
export default function ScenarioLayers({ scenario, result, layers }) {
  if (!scenario || !result) return null;
  const { track, radiusKm } = result;
  const size = (mult, v) => radiusKm * mult * 1000 * (0.4 + 0.6 * (v / 100));

  return (
    <>
      {layers.rain && (
        <Circle center={track.landfall} radius={size(1.4, scenario.rain)} interactive={false}
          pathOptions={{ color: "#2b6cb0", weight: 1, fillColor: "#3b82f6", fillOpacity: 0.12 }} />
      )}
      {layers.wind && (
        <Circle center={track.landfall} radius={size(1, scenario.wind)} interactive={false}
          pathOptions={{ color: "#7c3aed", weight: 1, fillColor: "#8b5cf6", fillOpacity: 0.18 }} />
      )}
      {layers.surge && (
        <Circle center={track.landfall} radius={size(0.8, scenario.surge)} interactive={false}
          pathOptions={{ color: "#0d9488", weight: 1, fillColor: "#14b8a6", fillOpacity: 0.22 }} />
      )}
      {layers.track && (
        <>
          <Polyline positions={[track.start, track.landfall, track.end]}
            pathOptions={{ color: "#111827", weight: 3, dashArray: "8 8" }}>
            <Tooltip sticky>Simulated track (not a forecast)</Tooltip>
          </Polyline>
          <CircleMarker center={track.start} radius={5} pathOptions={{ color: "#111827", fillColor: "#111827", fillOpacity: 1 }}>
            <Tooltip direction="top">Simulated cyclone start</Tooltip>
          </CircleMarker>
          <CircleMarker center={track.landfall} radius={8} pathOptions={{ color: "#111827", fillColor: "#fff", fillOpacity: 1, weight: 3 }}>
            <Tooltip permanent direction="top">Simulated landfall</Tooltip>
          </CircleMarker>
        </>
      )}
    </>
  );
}