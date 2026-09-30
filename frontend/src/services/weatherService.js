// Open-Meteo: free, no API key, no signup. https://open-meteo.com
export async function fetchLiveWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,wind_speed_10m,wind_gusts_10m`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo failed (HTTP ${res.status})`);
  const data = await res.json();
  return data.current; // { temperature_2m, precipitation, wind_speed_10m, wind_gusts_10m, time }
}