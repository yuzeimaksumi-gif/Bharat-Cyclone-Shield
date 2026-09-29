import { Fragment, useEffect } from "react";
import { MapContainer, TileLayer, Circle, CircleMarker, GeoJSON, Tooltip, Popup, useMap } from "react-leaflet";
import { REGIONS, INDIA_VIEW } from "../../data/regions";
import { getRiskLevel } from "../../constants/risk";
import useRegionGeo from "../../hooks/useRegionGeo";
import MapLegend from "./MapLegend";
import ScenarioLayers from "./ScenarioLayers";
import FacilityLayer from "./FacilityLayer";

function FlyToRegion({ regionId }) {
  const map = useMap();
  useEffect(() => {
    const r = REGIONS.find((x) => x.id === regionId);
    if (r) map.flyTo(r.center, 7, { duration: 1 });
  }, [regionId, map]);
  return null;
}

// Scroll-wheel zoom stays off until the user clicks the map.
function ScrollZoomGuard() {
  const map = useMap();
  useEffect(() => {
    const on = () => map.scrollWheelZoom.enable();
    const off = () => map.scrollWheelZoom.disable();
    map.on("click", on);
    map.on("mouseout", off);
    return () => { map.off("click", on); map.off("mouseout", off); };
  }, [map]);
  return null;
}

function ResetButton() {
  const map = useMap();
  return (
    <button className="map-reset" onClick={() => map.flyTo(INDIA_VIEW.center, INDIA_VIEW.zoom)}>
      ⟲ Reset to India
    </button>
  );
}

export default function IndiaMap({ selectedId, onSelect, layers, height = 520, scenario = null, result = null }) {
  const { geo, status } = useRegionGeo();
  const features = geo?.features ?? [];

  return (
    <div className="map-wrap" style={{ height }}>
      <MapContainer center={INDIA_VIEW.center} zoom={INDIA_VIEW.zoom} minZoom={4} zoomSnap={0.5} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Boundaries: <a href="https://www.geoboundaries.org">geoBoundaries</a> (CC BY 4.0)'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ScenarioLayers scenario={scenario} result={result} layers={layers} />
                {layers.facilities && <FacilityLayer result={result} />}

        {layers.risk &&
          REGIONS.map((r) => {
            const x = result?.regions[r.id];
            const score = x ? x.risk : r.demoScore; // computed risk once a scenario is analyzed
            const level = getRiskLevel(score);
            const isSel = r.id === selectedId;
            const style = {
              color: level.color, fillColor: level.color,
              fillOpacity: isSel ? 0.55 : 0.4, weight: isSel ? 3 : 1.5,
            };
            const detail = x
              ? `Hazard ${x.hazard} · Vulnerability ${x.vulnerability} · Exposure ${x.exposure}`
              : "Placeholder score (run a scenario)";
            const regionFeatures = features.filter((f) => f.properties.regionId === r.id);

            const label = layers.labels && (
              <CircleMarker center={r.center} radius={1} interactive={false} pathOptions={{ opacity: 0, fillOpacity: 0 }}>
                <Tooltip permanent direction="center" className="zone-label">{r.name}</Tooltip>
              </CircleMarker>
            );

            if (regionFeatures.length > 0) {
              return (
                <Fragment key={r.id}>
                  <GeoJSON
                    key={`${r.id}-${isSel}-${score}`}
                    data={{ type: "FeatureCollection", features: regionFeatures }}
                    style={() => style}
                    onEachFeature={(f, layer) => {
                      layer.bindPopup(
                        `<strong>${f.properties.districtName}</strong> district<br>` +
                        `Part of ${r.name}<br>Risk: ${score}/100 (${level.label}) <em>— SIMULATED</em><br>` +
                        `<small>${detail}</small>`
                      );
                      layer.on("click", () => onSelect(r.id));
                    }}
                  />
                  {label}
                </Fragment>
              );
            }

            return (
              <Fragment key={r.id}>
                <Circle center={r.center} radius={r.radiusKm * 1000} pathOptions={style}
                  eventHandlers={{ click: () => onSelect(r.id) }}>
                  <Popup>
                    <strong>{r.name}</strong><br />
                    Risk: {score}/100 ({level.label}) <em>— SIMULATED</em><br />
                    <small>{detail}</small><br />
                    <small><em>Illustrative zone, not an official boundary.</em></small>
                  </Popup>
                </Circle>
                {label}
              </Fragment>
            );
          })}

        <FlyToRegion regionId={selectedId} />
        <ScrollZoomGuard />
        <ResetButton />
      </MapContainer>
      <MapLegend usingGeo={status === "ready" && features.length > 0} scored={!!result} />
    </div>
  );
}