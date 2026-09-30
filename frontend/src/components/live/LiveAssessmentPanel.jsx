import { useState } from "react";
import Card from "../ui/Card";
import { REGIONS } from "../../data/regions";
import { fetchLiveWeather } from "../../services/weatherService";
import { multimodalStormAssessment } from "../../services/geminiService";
import { dispatchAdvisory } from "../../services/dispatchService";

// Representative reference photo - a real cyclone image, but not necessarily depicting
// the specific storm or region being analyzed. The prompt itself says this too.
const REF_IMAGE = "/images/bg-map.jpg";

export default function LiveAssessmentPanel({ selectedId, onSelect, sim }) {
  const id = selectedId ?? REGIONS[0].id;
  const region = REGIONS.find((r) => r.id === id);
  const risk = sim.result?.regions[id];

  const [weather, setWeather] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState("idle");
  const [assessment, setAssessment] = useState(null);
  const [assessStatus, setAssessStatus] = useState("idle");
  const [email, setEmail] = useState("");
  const [dispatchStatus, setDispatchStatus] = useState("idle");

  const loadWeather = async () => {
    setWeatherStatus("loading");
    try {
      setWeather(await fetchLiveWeather(region.center[0], region.center[1]));
      setWeatherStatus("ready");
    } catch { setWeatherStatus("error"); }
  };

  const runAssessment = async () => {
    setAssessStatus("loading");
    try {
      const text = await multimodalStormAssessment({
        imageUrl: REF_IMAGE, region,
        risk: risk ?? { hazard: 0, vulnerability: 0, exposure: 0, risk: 0 },
        liveWeather: weather,
      });
      setAssessment(text);
      setAssessStatus("ready");
    } catch { setAssessStatus("error"); }
  };

  const send = async () => {
    if (!email || !assessment) return;
    setDispatchStatus("sending");
    try {
      await dispatchAdvisory({ toEmail: email, region, advisoryText: assessment });
      setDispatchStatus("sent");
    } catch { setDispatchStatus("error"); }
  };

  return (
    <Card title="Live Assessment — Gemini 3.7 Flash" right={<span className="pill pill-live">MULTIMODAL AI</span>}>
      <div className="seg">
        {REGIONS.map((r) => (
          <button key={r.id} className={r.id === id ? "on" : ""} onClick={() => onSelect(r.id)}>
            {r.name.split(",")[0]}
          </button>
        ))}
      </div>

      <div className="field">
        <button className="go" onClick={loadWeather} disabled={weatherStatus === "loading"}>
          {weatherStatus === "loading" ? "Checking Open-Meteo…" : "🌦️ Get Live Weather at this Region"}
        </button>
        {weatherStatus === "ready" && weather && (
          <p className="note">
            Real conditions now: wind {weather.wind_speed_10m} km/h (gusts {weather.wind_gusts_10m}),
            precipitation {weather.precipitation} mm, {weather.temperature_2m}°C.
          </p>
        )}
        {weatherStatus === "error" && <p className="note warn">Could not reach Open-Meteo.</p>}
      </div>

      <div className="field">
        <button className="go" onClick={runAssessment} disabled={assessStatus === "loading"}>
          {assessStatus === "loading" ? "Analyzing with Gemini 3.7 Flash…" : "🛰️ Generate AI Storm Assessment"}
        </button>
        {!risk && <p className="muted small">No scenario run yet — analyze one on the Cyclone Impact Map first for a live score.</p>}
        {assessStatus === "ready" && <p className="note">{assessment}</p>}
        {assessStatus === "error" && <p className="note warn">Gemini request failed — check your API key.</p>}
        <p className="muted small">Reference satellite image is illustrative, not a live image of this specific storm.</p>
      </div>

      {assessment && (
        <div className="field">
          <label>Dispatch this advisory to</label>
          <input type="email" placeholder="officer@example.gov.in" value={email}
            onChange={(e) => setEmail(e.target.value)} className="live-email" />
          <button className="go" style={{ marginTop: 8 }} onClick={send} disabled={dispatchStatus === "sending"}>
            {dispatchStatus === "sending" ? "Sending…" : "📤 Dispatch Advisory"}
          </button>
          {dispatchStatus === "sent" && <p className="note">Advisory sent.</p>}
          {dispatchStatus === "error" && <p className="note warn">Dispatch failed — check your EmailJS keys.</p>}
        </div>
      )}
    </Card>
  );
}