import { useState } from "react";
import Card from "../components/ui/Card";
import CategoryPicker from "../components/infra/CategoryPicker";
import CategoryDetail from "../components/infra/CategoryDetail";
import IndiaMap from "../components/map/IndiaMap";
import { REGIONS } from "../data/regions";
import { PROFILES } from "../data/profiles";
import { DEFAULT_LAYER_STATE } from "../constants/layers";

export default function InfraView({ selectedId, onSelect, sim }) {
  const id = selectedId ?? REGIONS[0].id;
  const region = REGIONS.find((r) => r.id === id);
  const profile = PROFILES[id];
  const live = sim.result?.regions[id]?.cats;
  const [cat, setCat] = useState(null);

  const layers = { ...DEFAULT_LAYER_STATE, wind: false, facilities: true };

  return (
    <div className="stack">
      <div className="seg">
        {REGIONS.map((r) => (
          <button key={r.id} className={r.id === id ? "on" : ""} onClick={() => { onSelect(r.id); setCat(null); }}>
            {r.name}
          </button>
        ))}
      </div>

      <div className="grid two">
        <Card title="Infrastructure map (illustrative markers)" right={<span className="pill pill-warn">SAMPLE DATA</span>}>
          <IndiaMap selectedId={id} onSelect={onSelect} layers={layers} height={420}
            scenario={sim.scenario} result={sim.result} />
        </Card>
        <Card title={`${region.name}: infrastructure categories`}>
          <CategoryPicker infra={profile.infra} live={live} activeCat={cat} onPick={setCat} />
          <hr className="div" />
          <CategoryDetail region={region} infra={profile.infra} live={live} catId={cat} />
        </Card>
      </div>
    </div>
  );
}