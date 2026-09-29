// GDACS = Global Disaster Awareness and Coordination System (EU JRC / UN OCHA).
// Free, keyless, public GeoJSON API. Docs: https://www.gdacs.org/gdacsapi/swagger/index.html
// Terms of use require crediting "Global Disaster Awareness and Coordination System, GDACS".
const GDACS_URL = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH";

const iso = (d) => d.toISOString().slice(0, 10);

export async function fetchLiveCyclones() {
  const to = new Date();
  const from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000); // look back 30 days
  const url = `${GDACS_URL}?eventlist=TC&fromdate=${iso(from)}&todate=${iso(to)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`GDACS responded with HTTP ${res.status}`);
  const data = await res.json();
  const features = data?.features ?? [];

  return features.map((f) => {
    const p = f.properties ?? {};
    const [lon, lat] = f.geometry?.coordinates ?? [null, null];
    return {
      id: p.eventid ?? p.eventId ?? `${p.eventname}-${p.fromdate}`,
      name: p.eventname || p.name || "Unnamed tropical cyclone",
      alertLevel: p.alertlevel || p.alertLevel || "Green",
      country: p.country || p.affectedcountries || "—",
      fromDate: p.fromdate,
      toDate: p.todate,
      lat, lon,
      reportUrl: `https://www.gdacs.org/resources.aspx?eventid=${p.eventid ?? ""}&eventtype=TC`,
    };
  });
}

// Rough North Indian Ocean box (Arabian Sea + Bay of Bengal) - illustrative, not an official boundary.
export function isNearIndia(c) {
  return c.lat != null && c.lon != null && c.lat >= 0 && c.lat <= 30 && c.lon >= 60 && c.lon <= 100;
}