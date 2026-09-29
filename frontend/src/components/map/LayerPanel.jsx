import Card from "../ui/Card";
import { MAP_LAYERS } from "../../constants/layers";

export default function LayerPanel({ layers, onToggle }) {
  return (
    <Card title="Map Layers">
      {MAP_LAYERS.map((l) => (
        <label key={l.id} className={`layer-row ${l.ready ? "" : "disabled"}`}>
          <input
            type="checkbox"
            disabled={!l.ready}
            checked={!!layers[l.id]}
            onChange={() => onToggle(l.id)}
          />
          <span>{l.label}</span>
          {!l.ready && <em>Phase {l.phase}</em>}
        </label>
      ))}
    </Card>
  );
}