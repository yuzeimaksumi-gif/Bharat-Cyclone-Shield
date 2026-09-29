// TEMPORARY demo data. Geometry = illustrative circles (NOT real boundaries).
// Phase 4 replaces geometry with GeoJSON; Phase 7 replaces demoScore with the risk engine.
export const INDIA_VIEW = { center: [21.5, 80.5], zoom: 4.5 };

export const REGIONS = [
  {
    id: "odisha",
    name: "Coastal Odisha",
    center: [20.0, 86.3],
    radiusKm: 110,
    demoScore: 64,
    focus: "Coastal exposure, strong winds, storm surge, infrastructure vulnerability",
    traits: ["Wind exposure", "Storm surge", "Coastal infrastructure", "Power lines", "Cyclone shelters"],
  },
  {
    id: "sundarbans",
    name: "Sundarbans, West Bengal",
    center: [21.9, 88.8],
    radiusKm: 90,
    demoScore: 78,
    focus: "Low elevation, riverine flooding, inundation, embankments, island connectivity",
    traits: ["Low elevation", "Riverine flooding", "Embankments", "Island connectivity", "Inundation"],
  },
  {
    id: "tamilnadu",
    name: "Coastal Tamil Nadu",
    center: [11.9, 79.8],
    radiusKm: 100,
    demoScore: 61,
    focus: "Coastal exposure, urban flooding, drainage, roads, essential services",
    traits: ["Urban flooding", "Drainage capacity", "Road network", "Hospitals", "Essential services"],
  },
];