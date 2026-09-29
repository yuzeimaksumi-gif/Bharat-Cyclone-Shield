import { REGIONS } from "../data/regions";
import { PROFILES } from "../data/profiles";
import { INTENSITIES, LANDFALLS } from "../constants/scenario";
import { destinationPoint, distanceToSegmentKm, haversineKm } from "./geo";

// Simulated straight-line track: 700 km out at sea -> landfall -> 300 km inland.
export function buildTrack(s) {
  const lf = LANDFALLS.find((l) => l.id === s.landfallId);
  return {
    landfall: lf.point,
    start: destinationPoint(lf.point, s.approach, 700),
    end: destinationPoint(lf.point, (s.approach + 180) % 360, 300),
  };
}

const decay = (d, R) => Math.exp(-((d / R) ** 2)); // 1 at the track, fades with distance

// Hazard per region (0-100). Transparent rules:
//   effective wind  = wind  x decay(distance to track,    R)
//   effective rain  = rain  x decay(distance to track,    1.4R)  (rain field is wider)
//   effective surge = surge x decay(distance to landfall, 0.8R)  (surge is more local)
//   hazard = sum(region weight x effective value)      <- weights differ by region
export function computeHazard(s) {
  const R = INTENSITIES[s.intensity].radiusKm;
  const track = buildTrack(s);
  const regions = {};
  REGIONS.forEach((r) => {
    const w = PROFILES[r.id].hazardWeights;
    const dTrack = distanceToSegmentKm(r.center, track.start, track.end);
    const dLand = haversineKm(r.center, track.landfall);
    const uniform = s.mode === "uniform";
    const wind = s.wind * (uniform ? 1 : decay(dTrack, R));
    const rain = s.rain * (uniform ? 1 : decay(dTrack, R * 1.4));
    const surge = s.surge * (uniform ? 1 : decay(dLand, R * 0.8));
    regions[r.id] = {
      distanceKm: Math.round(dTrack),
      wind: Math.round(wind), rain: Math.round(rain), surge: Math.round(surge),
      hazard: Math.round(w.wind * wind + w.rain * rain + w.surge * surge),
    };
  });
  return { track, radiusKm: R, regions };
}