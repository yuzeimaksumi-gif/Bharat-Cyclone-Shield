// ILLUSTRATIVE expert-judgement sample data (0-100, higher = more exposed/vulnerable).
// NOT measured or validated. Phase 12 can replace parts of this with real datasets.

export const DRIVERS = [
  { id: "coastal",    label: "Coastal exposure" },
  { id: "lowElev",    label: "Low elevation" },
  { id: "drainage",   label: "Drainage / flood-retention weakness" },
  { id: "density",    label: "Population density" },
  { id: "buildings",  label: "Building-stock fragility" },
  { id: "redundancy", label: "Lack of network redundancy" },
  { id: "evac",       label: "Evacuation / connectivity constraint" },
];

export const CATEGORIES = [
  { id: "roads",       label: "Roads" },
  { id: "bridges",     label: "Bridges" },
  { id: "buildings",   label: "Buildings" },
  { id: "hospitals",   label: "Hospitals" },
  { id: "power",       label: "Power infrastructure" },
  { id: "shelters",    label: "Emergency shelters" },
  { id: "embankments", label: "Coastal embankments" },
];

// Helper: [records, primaryHazard, baseVulnerability, reason, serviceDisruption, action]
const c = (records, hazard, base, reason, disruption, action) =>
  ({ records, hazard, base, reason, disruption, action });

export const PROFILES = {
  odisha: {
    signature: "Wind- and surge-dominated coast: exposed power lines, coastal roads and a shelter network.",
    hazardWeights: { wind: 0.45, rain: 0.25, surge: 0.30 },
    drivers: { coastal: 85, lowElev: 55, drainage: 45, density: 50, buildings: 65, redundancy: 55, evac: 45 },
    infra: {
      roads:       c(120, "Storm surge", 58, "Coastal highways are exposed to surge overtopping and wind-blown debris.", "Coastal blocks may be cut off for hours to days.", "Pre-clear debris and mark alternate inland routes."),
      bridges:     c(45, "Storm surge", 55, "Estuary crossings are vulnerable to surge loading and scour.", "Coastal blocks may be split from district headquarters.", "Inspect approaches and scour protection."),
      buildings:   c(900, "Wind", 68, "Mixed kutcha/pucca housing near the coast is wind-vulnerable.", "Displacement and shelter demand rise sharply.", "Prioritise evacuation of weak housing."),
      hospitals:   c(18, "Wind", 48, "Facilities are mostly inland but depend on exposed power and access roads.", "Reduced care capacity if power or access fails.", "Test backup generators and fuel stocks."),
      power:       c(60, "Wind", 74, "Overhead lines and coastal substations are highly wind-exposed.", "Widespread multi-day outages are plausible.", "Pre-position repair crews and spare poles."),
      shelters:    c(85, "Wind", 38, "A shelter network exists; capacity, upkeep and access need review.", "Overcrowding if capacity is short.", "Review capacity, water and power backup."),
      embankments: c(30, "Storm surge", 62, "Coastal and river embankments face overtopping and breach risk.", "Inundation of low-lying villages.", "Inspect weak sections and stock sandbags."),
    },
  },
  sundarbans: {
    signature: "Low-lying deltaic islands: inundation, tidal/riverine flooding, embankments and fragile connectivity.",
    hazardWeights: { wind: 0.25, rain: 0.30, surge: 0.45 },
    drivers: { coastal: 90, lowElev: 95, drainage: 70, density: 60, buildings: 80, redundancy: 85, evac: 90 },
    infra: {
      roads:       c(70, "Flooding", 72, "Low raised roads with few alternate routes flood easily.", "Villages isolated when roads submerge.", "Identify flood-prone stretches and boat alternatives."),
      bridges:     c(20, "Flooding", 60, "Few crossings; island links depend on ferries and jetties.", "Island connectivity lost when ferries stop.", "Check jetties and ferry contingency plans."),
      buildings:   c(800, "Flooding", 80, "Low-lying mud and thatch housing is highly exposed to inundation.", "Mass displacement from flooded settlements.", "Plan early evacuation to elevated shelters."),
      hospitals:   c(10, "Flooding", 70, "Sparse facilities; access is disrupted when waterways swell.", "Emergency care delayed by water access.", "Pre-stock supplies and plan boat transfers."),
      power:       c(35, "Flooding", 65, "A dispersed grid with tidal flooding of substations.", "Long restoration times across islands.", "Raise or protect key substations; stage spares."),
      shelters:    c(40, "Flooding", 62, "Few elevated shelters relative to a dispersed population.", "Insufficient safe capacity for some islands.", "Map shelter gaps and elevated refuge points."),
      embankments: c(55, "Storm surge", 88, "Long earthen embankments are critical and prone to overtopping and breach.", "Breach floods large areas and farmland.", "Inspect embankments and prepare rapid repair teams."),
    },
  },
  tamilnadu: {
    signature: "Dense, urbanised coast: drainage, waterlogging, roads and continuity of essential services.",
    hazardWeights: { wind: 0.30, rain: 0.45, surge: 0.25 },
    drivers: { coastal: 75, lowElev: 50, drainage: 80, density: 85, buildings: 50, redundancy: 40, evac: 50 },
    infra: {
      roads:       c(150, "Rainfall", 68, "Dense urban roads are prone to waterlogging.", "Traffic and emergency access slowed or blocked.", "Identify waterlogging points and plan diversions."),
      bridges:     c(60, "Rainfall", 45, "Generally robust, with river-flood exposure at low causeways.", "Local crossings closed during high flow.", "Monitor causeways and river levels."),
      buildings:   c(1200, "Rainfall", 58, "Dense construction; drainage limits drive flood damage.", "Urban flooding of homes and shops.", "Clear drains ahead of rain; notify low-lying areas."),
      hospitals:   c(30, "Rainfall", 52, "Good coverage, but access can be cut by waterlogging.", "Delayed patient access and staff arrival.", "Check accessibility and backup power."),
      power:       c(70, "Rainfall", 55, "A mixed grid with substation flooding risk in low areas.", "Localised outages; safety shut-offs.", "Protect low-lying substations."),
      shelters:    c(60, "Wind", 44, "Adequate count, but demand is high in dense areas.", "Crowding at shelters.", "Review capacity in high-density wards."),
      embankments: c(25, "Rainfall", 50, "River and canal embankments in the delta face high-flow stress.", "Local flooding if sections fail.", "Inspect canal and river embankments."),
    },
  },
};