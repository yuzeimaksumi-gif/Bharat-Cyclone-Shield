import Card from "../components/ui/Card";
import DriverBars from "../components/regional/DriverBars";
import RegionRadar from "../components/regional/RegionRadar";
import InventoryTable from "../components/regional/InventoryTable";
import { REGIONS } from "../data/regions";
import { PROFILES } from "../data/profiles";

export default function RegionalView({ selectedId, onSelect }) {
  const id = selectedId ?? REGIONS[0].id; // default to the first region if none chosen
  const region = REGIONS.find((r) => r.id === id);
  const profile = PROFILES[id];
  const w = profile.hazardWeights;

  return (
    <div className="stack">
      <div className="seg">
        {REGIONS.map((r) => (
          <button key={r.id} className={r.id === id ? "on" : ""} onClick={() => onSelect(r.id)}>
            {r.name}
          </button>
        ))}
      </div>

      <div className="grid two">
        <Card title={`${region.name}: regional profile`} right={<span className="pill pill-warn">ILLUSTRATIVE</span>}>
          <p><b>Signature:</b> {profile.signature}</p>
          <p className="muted small">{region.focus}.</p>
          <h4 className="sub">Hazard sensitivity (weights used by the risk engine)</h4>
          {[["Wind", w.wind], ["Rainfall", w.rain], ["Storm surge", w.surge]].map(([n, v]) => (
            <div className="row" key={n}>
              <div className="row-h"><span>{n}</span><b>{Math.round(v * 100)}%</b></div>
              <div className="bar"><i style={{ width: `${v * 100}%`, background: "#1f5fd6" }} /></div>
            </div>
          ))}
          <p className="note">The same cyclone weighs differently here than in other regions.</p>
        </Card>

        <Card title="Regional drivers compared (all regions)">
          <RegionRadar selectedId={id} />
        </Card>
      </div>

      <div className="grid two">
        <Card title="Vulnerability drivers (0-100)">
          <DriverBars drivers={profile.drivers} />
          <p className="note">Higher = more exposed or vulnerable. Illustrative expert-judgement values, not measured data.</p>
        </Card>
        <Card title="Infrastructure inventory (illustrative)">
          <InventoryTable infra={profile.infra} />
        </Card>
      </div>
    </div>
  );
}