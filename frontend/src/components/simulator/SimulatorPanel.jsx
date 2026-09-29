import Card from "../ui/Card";
import { REGIONS } from "../../data/regions";
import { INTENSITIES, LANDFALLS } from "../../constants/scenario";

const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function Slider({ label, value, onChange, max = 100, unit = "" }) {
  return (
    <div className="field">
      <label><span>{label}</span><b>{value}{unit}</b></label>
      <input type="range" min="0" max={max} value={value} onChange={(e) => onChange(+e.target.value)} />
    </div>
  );
}

export default function SimulatorPanel({ sim, selectedId, onSelect }) {
  const { draft, setDraft, scenario, run } = sim;
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const pick = (name) => {
    const p = INTENSITIES[name];
    set({ intensity: name, wind: p.wind, rain: p.rain, surge: p.surge });
  };
  const landfall = LANDFALLS.find((l) => l.id === scenario?.landfallId);

  return (
    <Card title="Cyclone Scenario Simulator" right={<span className="pill pill-warn">SIMULATED</span>}>
      <div className="field">
        <label>Region focus</label>
        <select value={selectedId ?? ""} onChange={(e) => onSelect(e.target.value || null)}>
          <option value="">All regions</option>
          {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>

      <div className="field">
        <label>Cyclone intensity</label>
        <div className="seg">
          {Object.keys(INTENSITIES).map((n) => (
            <button key={n} className={draft.intensity === n ? "on" : ""} onClick={() => pick(n)}>{n}</button>
          ))}
        </div>
      </div>

      <Slider label="Wind speed (index)" value={draft.wind} onChange={(v) => set({ wind: v })} />
      <Slider label="Rainfall intensity" value={draft.rain} onChange={(v) => set({ rain: v })} />
      <Slider label="Storm-surge exposure" value={draft.surge} onChange={(v) => set({ surge: v })} />

      <div className="field">
        <label>Landfall location (simulated)</label>
        <select value={draft.landfallId}
          onChange={(e) => set({ landfallId: e.target.value, approach: LANDFALLS.find((l) => l.id === e.target.value).approach })}>
          {LANDFALLS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
      </div>
      <Slider label={`Approach direction (from ${DIRS[Math.round(draft.approach / 45) % 8]})`}
        value={draft.approach} max={359} unit="°" onChange={(v) => set({ approach: v })} />

      <div className="field">
        <label>Regional exposure to the cyclone</label>
        <div className="seg">
          <button className={draft.mode === "track" ? "on" : ""} onClick={() => set({ mode: "track" })}>Track-based</button>
          <button className={draft.mode === "uniform" ? "on" : ""} onClick={() => set({ mode: "uniform" })}>Same everywhere</button>
        </div>
        <p className="note">"Same everywhere" applies identical inputs to every region, so differences come only from regional profiles.</p>
      </div>

      <button className="go" onClick={run}>Analyze Regional Impact</button>
            {scenario && JSON.stringify(scenario) !== JSON.stringify(draft) && (
        <p className="note warn">Controls changed since the last analysis. Click "Analyze Regional Impact" to update the map.</p>
      )}
      {scenario && (
        <p className="note">Analyzed: {scenario.intensity} · landfall {landfall?.label} · {scenario.mode === "track" ? "track-based" : "uniform"} (SIMULATED)</p>
      )}
    </Card>
  );
}