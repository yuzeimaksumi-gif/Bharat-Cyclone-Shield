export const MAP_LAYERS = [
  { id: "risk",       label: "Overall regional risk zones", ready: true },
  { id: "labels",     label: "Region labels",               ready: true },
  { id: "track",      label: "Cyclone track (simulated)",   ready: true },
  { id: "wind",       label: "Wind hazard footprint",       ready: true },
  { id: "rain",       label: "Rainfall / flood footprint",  ready: true },
  { id: "surge",      label: "Storm-surge footprint",       ready: true },
  { id: "infravuln",  label: "Infrastructure vulnerability", ready: false, phase: 8 },
  { id: "facilities", label: "Critical facilities",         ready: true },
];

export const DEFAULT_LAYER_STATE = { risk: true, labels: true, track: true, wind: true, rain: false, surge: false };