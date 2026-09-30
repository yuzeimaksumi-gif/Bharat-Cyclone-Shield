const KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// 1. Text Briefing Export
export async function generateBriefing({ region, scenario, risk }) {
  if (!KEY) throw new Error("Missing VITE_GEMINI_API_KEY environment variable.");

  const prompt = `You are writing a short disaster-preparedness briefing for a hackathon prototype.
Region: ${region.name} (${region.focus}).
Simulated cyclone: ${scenario.intensity} intensity, ${scenario.mode === "track" ? "track-based" : "same-everywhere"} exposure.
Computed scores (0-100, prototype model): hazard ${risk.hazard}, infrastructure vulnerability ${risk.vulnerability}, exposure ${risk.exposure}, overall risk ${risk.risk}.
Write 3 short sentences in plain English explaining what this means for this region, in a calm, practical tone.
Do not claim this is an official forecast. Do not invent specific numbers not given above.`;

  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  if (!res.ok) throw new Error(`Gemini request failed (HTTP ${res.status})`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No briefing generated.";
}

// Helper function to convert dynamic image URLs to base64
async function imageUrlToBase64(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image (HTTP ${res.status})`);
  
  const blob = await res.blob();
  const mimeType = blob.type || "image/jpeg";

  const base64Data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  return { base64Data, mimeType };
}

// 2. Multimodal Storm Assessment Export (Required by LiveAssessmentPanel.jsx)
export async function multimodalStormAssessment({ imageUrl, region, risk, liveWeather }) {
  if (!KEY) throw new Error("Missing VITE_GEMINI_API_KEY environment variable.");

  const { base64Data, mimeType } = await imageUrlToBase64(imageUrl);
  const prompt = `You are assisting a disaster-management dashboard prototype.
Analyze the attached satellite cyclone image visually: describe storm structure, eye definition, and apparent organization in 2 sentences.
Then combine that with this region's computed prototype risk data for ${region.name}: hazard ${risk.hazard}, vulnerability ${risk.vulnerability}, exposure ${risk.exposure}, overall risk ${risk.risk}/100.
${liveWeather ? `Current real conditions at this location: wind ${liveWeather.wind_speed_10m} km/h, precipitation${liveWeather.precipitation} mm.` : ""}
Write a 4-sentence early-warning advisory a municipal disaster officer could act on. Do not claim this is an official forecast.`;

  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: base64Data } }] }],
    }),
  });

  if (!res.ok) throw new Error(`Gemini request failed (HTTP ${res.status})`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No assessment generated.";
}