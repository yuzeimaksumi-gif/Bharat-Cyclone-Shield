import { PROFILES, CATEGORIES } from "../data/profiles";

// Static, region-specific baseline actions (from the project brief).
const BASE = {
  odisha: [
    "Inspect exposed coastal infrastructure (embankments, jetties, coastal roads).",
    "Review cyclone shelter readiness, capacity and access.",
    "Prioritize vulnerable roads and power facilities for pre-storm checks.",
  ],
  sundarbans: [
    "Inspect embankments and flood-prone access routes.",
    "Review evacuation connectivity (boats, jetties, raised roads).",
    "Prepare for possible inundation and tidal flooding.",
  ],
  tamilnadu: [
    "Review urban drainage capacity and clear blocked channels.",
    "Identify roads vulnerable to waterlogging and plan diversions.",
    "Check the accessibility of hospitals and emergency facilities.",
  ],
};

const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

// Builds a full recommendation list for one region: static baseline + rules driven by the
// live scenario result (if one has been run). Priority: "urgent" | "recommended" | "routine".
export function buildRecommendations(regionId, regionResult) {
  const base = BASE[regionId].map((text) => ({ text, priority: "recommended", why: "Standing regional guidance." }));
  const dynamic = [];

  if (regionResult) {
    const { risk, hazard, wind, rain, surge, cats } = regionResult;
    const top = [...cats].sort((a, b) => b.vuln - a.vuln).slice(0, 2);

    if (risk >= 75) {
      dynamic.push({ text: "PRIORITY: Very High simulated risk — escalate readiness checks and confirm evacuation plans now.", priority: "urgent", why: `Overall risk ${risk}/100 in this scenario.` });
    } else if (risk >= 50) {
      dynamic.push({ text: "High simulated risk — complete pre-storm inspections before the scenario's projected impact.", priority: "urgent", why: `Overall risk ${risk}/100 in this scenario.` });
    }

    top.forEach((c) => {
      dynamic.push({
        text: `Inspect and prepare: ${catLabel(c.id)} (vulnerability ${c.vuln}/100 in this scenario).`,
        priority: c.vuln >= 60 ? "urgent" : "recommended",
        why: `Ranks among the most vulnerable categories under this scenario's hazard mix.`,
      });
    });

    if (surge >= 55) dynamic.push({ text: "Verify low-lying access routes and coastal/embankment defences.", priority: "recommended", why: `Effective storm-surge input ${surge}/100.` });
    if (rain >= 55) dynamic.push({ text: "Check drainage, waterlogging points and hospital access routes.", priority: "recommended", why: `Effective rainfall input ${rain}/100.` });
    if (wind >= 55) dynamic.push({ text: "Secure power lines, hoardings, signage and weak structures.", priority: "recommended", why: `Effective wind input ${wind}/100.` });

    if (risk < 25) dynamic.push({ text: "Simulated risk is low for this scenario. Routine monitoring and readiness review are sufficient.", priority: "routine", why: `Overall risk ${risk}/100 in this scenario.` });
  } else {
    dynamic.push({ text: "Run a scenario on the Cyclone Impact Map for scenario-specific priorities.", priority: "routine", why: "No scenario analyzed yet — showing standing guidance only." });
  }

  const order = { urgent: 0, recommended: 1, routine: 2 };
  return [...dynamic, ...base].sort((a, b) => order[a.priority] - order[b.priority]);
}