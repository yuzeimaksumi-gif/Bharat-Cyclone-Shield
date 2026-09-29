import { CATEGORIES } from "../../data/profiles";
import { CATEGORY_ICON } from "../../data/facilities";
import { getRiskLevel } from "../../constants/risk";

export default function CategoryPicker({ infra, live, activeCat, onPick }) {
  return (
    <div className="cat-grid">
      {CATEGORIES.map((cat) => {
        const dyn = live?.find((c) => c.id === cat.id);
        const score = dyn ? dyn.vuln : infra[cat.id].base;
        const level = getRiskLevel(score);
        return (
          <button key={cat.id} className={`cat-btn ${activeCat === cat.id ? "on" : ""}`} onClick={() => onPick(cat.id)}>
            <span className="cat-ico">{CATEGORY_ICON[cat.id]}</span>
            <span className="cat-label">{cat.label}</span>
            <span className="cat-score" style={{ color: level.color }}>{score}</span>
          </button>
        );
      })}
    </div>
  );
}