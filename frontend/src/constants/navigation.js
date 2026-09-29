// Single source of truth for the sidebar and the header title.
export const NAV_ITEMS = [
  { id: "overview",   label: "Overview Dashboard",         icon: "▦", phase: 2,  desc: "National summary of simulated regional risk" },
  { id: "map",        label: "Cyclone Impact Map",         icon: "◉", phase: 3,  desc: "Interactive GIS map with hazard and risk layers" },
  { id: "regional",   label: "Regional Vulnerability",     icon: "◈", phase: 5,  desc: "Region-specific vulnerability profiles and score breakdown" },
  { id: "infra",      label: "Infrastructure Risk",        icon: "⌂", phase: 8,  desc: "Roads, bridges, hospitals, power, shelters and embankments" },
  { id: "compare",    label: "Regional Comparison",        icon: "▥", phase: 9,  desc: "Same cyclone, different regional outcomes" },
  { id: "prepare",    label: "Preparedness & Response",    icon: "✚", phase: 10, desc: "Context-sensitive prototype recommendations" },
];