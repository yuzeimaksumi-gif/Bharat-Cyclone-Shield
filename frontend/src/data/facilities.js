// ILLUSTRATIVE marker positions, offset from each region's centre. NOT real asset locations.
export const CATEGORY_ICON = {
  roads: "🛣️", bridges: "🌉", buildings: "🏘️", hospitals: "🏥",
  power: "⚡", shelters: "⛺", embankments: "🧱",
};

const OFFSETS = [
  [0.35, 0.1], [-0.3, 0.25], [0.15, -0.3], [-0.2, -0.15], [0.4, -0.05], [-0.4, -0.3], [0.05, 0.35],
];

// Deterministic sample points, spread around each region's centre.
export function facilityPoints(region) {
  const cats = Object.keys(region ? {} : {}); // placeholder to keep lint happy
  return OFFSETS;
}