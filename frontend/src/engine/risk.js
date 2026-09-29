import { REGIONS } from "../data/regions";
import { PROFILES } from "../data/profiles";
import { computeHazard } from "./hazard";

// PROTOTYPE weights - not validated against real loss data.
export const WEIGHTS = { hazard: 0.35, vuln: 0.40, exposure: 0.25 };

const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const r1 = (x) => Math.round(x * 10) / 10;

// Which effective hazard (0-100) drives each infrastructure category.
function relevantHazard(primary, h) {
  switch (primary) {
    case "Wind": return h.wind;
    case "Storm surge": return h.surge;
    case "Rainfall": return h.rain;
    case "Flooding": return (h.rain + h.surge) / 2;
    default: return (h.wind + h.rain + h.surge) / 3;
  }
}

export function computeRisk(scenario) {
  const base = computeHazard(scenario);
  const regions = {};

  REGIONS.forEach((r) => {
    const p = PROFILES[r.id];
    const h = base.regions[r.id];

    // 1. Infrastructure vulnerability: baseline, activated by the category's own hazard
    const cats = Object.entries(p.infra).map(([id, c]) => {
      const catHaz = relevantHazard(c.hazard, h);
      return { id, catHaz: Math.round(catHaz), vuln: Math.round(c.base * (0.25 + (0.75 * catHaz) / 100)) };
    });
    const V = mean(cats.map((c) => c.vuln));

    // 2. Exposure: regional exposure drivers, scaled by how strongly the hazard reaches the region
    const d = p.drivers;
    const E0 = 0.4 * d.density + 0.35 * d.coastal + 0.25 * d.lowElev;
    const activation = 0.2 + (0.8 * h.hazard) / 100;
    const E = E0 * activation;

    // 3. Combine
    const parts = {
      hazard: r1(WEIGHTS.hazard * h.hazard),
      vuln: r1(WEIGHTS.vuln * V),
      exposure: r1(WEIGHTS.exposure * E),
    };
    const risk = Math.round(WEIGHTS.hazard * h.hazard + WEIGHTS.vuln * V + WEIGHTS.exposure * E);

    regions[r.id] = {
      ...h, // hazard, wind, rain, surge, distanceKm from Phase 6
      vulnerability: Math.round(V),
      exposureBase: Math.round(E0),
      activation: Math.round(activation * 100) / 100,
      exposure: Math.round(E),
      parts, risk, cats,
    };
  });

  return { ...base, regions };
}