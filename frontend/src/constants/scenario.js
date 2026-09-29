// Intensity presets (SIMULATED). radiusKm = base size of the hazard footprint.
export const INTENSITIES = {
  Low:      { wind: 30, rain: 25, surge: 20, radiusKm: 120 },
  Moderate: { wind: 50, rain: 45, surge: 40, radiusKm: 200 },
  High:     { wind: 70, rain: 65, surge: 60, radiusKm: 300 },
  Severe:   { wind: 90, rain: 85, surge: 80, radiusKm: 400 },
};

// Illustrative landfall points. `approach` = default bearing (degrees) from landfall back toward the sea.
export const LANDFALLS = [
  { id: "odisha",     label: "Odisha coast (near Puri)",         point: [19.8, 85.8],  approach: 150 },
  { id: "sundarbans", label: "Sundarbans delta",                  point: [21.7, 88.9],  approach: 170 },
  { id: "tamilnadu",  label: "Tamil Nadu coast (near Cuddalore)", point: [11.75, 79.8], approach: 100 },
];

export const DEFAULT_DRAFT = {
  intensity: "High", ...INTENSITIES.High,
  landfallId: "odisha", approach: 150,
  mode: "track", // "track" = distance-based, "uniform" = same exposure everywhere
};