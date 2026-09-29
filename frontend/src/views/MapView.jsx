import { useState } from "react";
import IndiaMap from "../components/map/IndiaMap";
import LayerPanel from "../components/map/LayerPanel";
import RegionInfoPanel from "../components/map/RegionInfoPanel";
import SimulatorPanel from "../components/simulator/SimulatorPanel";
import RiskResults from "../components/simulator/RiskResults";
import RiskBreakdown from "../components/simulator/RiskBreakdown";
import Card from "../components/ui/Card";
import { DEFAULT_LAYER_STATE } from "../constants/layers";

export default function MapView({ selectedId, onSelect, sim }) {
  const [layers, setLayers] = useState(DEFAULT_LAYER_STATE);
  const toggle = (id) => setLayers((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="grid map-layout">
      <Card
        title="India Cyclone Impact Map"
        right={<span className="pill pill-warn">District-based zones · SIMULATED</span>}
      >
        <IndiaMap selectedId={selectedId} onSelect={onSelect} layers={layers} height={640}
          scenario={sim.scenario} result={sim.result} />
      </Card>
      <div className="stack">
        <SimulatorPanel sim={sim} selectedId={selectedId} onSelect={onSelect} />
        <RiskResults result={sim.result} selectedId={selectedId} onSelect={onSelect} />
        <RiskBreakdown result={sim.result} selectedId={selectedId} />
        <RegionInfoPanel selectedId={selectedId} onSelect={onSelect} />
        <LayerPanel layers={layers} onToggle={toggle} />
      </div>
    </div>
  );
}