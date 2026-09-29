const R = 6371; // Earth radius, km
const rad = (d) => (d * Math.PI) / 180;
const deg = (r) => (r * 180) / Math.PI;

export function haversineKm([lat1, lon1], [lat2, lon2]) {
  const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Point reached by travelling distKm from `start` on a compass bearing.
export function destinationPoint([lat, lon], bearingDeg, distKm) {
  const d = distKm / R, t = rad(bearingDeg), p1 = rad(lat), l1 = rad(lon);
  const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(t));
  const l2 = l1 + Math.atan2(Math.sin(t) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
  return [deg(p2), deg(l2)];
}

// Approximate distance (km) from point p to the segment a-b (local flat projection, fine at this scale).
export function distanceToSegmentKm(p, a, b) {
  const k = Math.cos(rad(p[0]));
  const xy = ([lat, lon]) => [(lon - p[1]) * 111.32 * k, (lat - p[0]) * 110.57];
  const [ax, ay] = xy(a), [bx, by] = xy(b);
  const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
  let t = len2 ? -(ax * dx + ay * dy) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(ax + t * dx, ay + t * dy);
}