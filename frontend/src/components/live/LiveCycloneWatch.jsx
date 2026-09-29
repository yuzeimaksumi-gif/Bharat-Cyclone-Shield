import Card from "../ui/Card";
import useLiveCyclones from "../../hooks/useLiveCyclones";
import { isNearIndia } from "../../services/gdacsService";

const ALERT_COLOR = { Green: "#22a559", Orange: "#f08a1c", Red: "#d92d20" };

export default function LiveCycloneWatch() {
  const { status, cyclones, updatedAt, error, reload } = useLiveCyclones();

  return (
    <Card title="Live Cyclone Watch" right={<span className="pill pill-live">REAL DATA — GDACS</span>}>
      {status === "loading" && <p className="muted small">Checking GDACS for active tropical cyclones worldwide…</p>}

      {status === "error" && (
        <div>
          <p className="muted small">Could not reach the GDACS feed from this browser ({error}).</p>
          <a className="live-link" href="https://www.gdacs.org/default.aspx?event_types=TC" target="_blank" rel="noreferrer">
            Check active cyclones on GDACS.org directly →
          </a>
          <button className="go" style={{ marginTop: 10 }} onClick={reload}>Retry</button>
        </div>
      )}

      {status === "ready" && (
        <>
          {cyclones.length === 0 ? (
            <p className="muted small">No tropical cyclone events reported by GDACS worldwide in the last 30 days.</p>
          ) : (
            cyclones.slice(0, 6).map((c) => (
              <a key={c.id} className="live-row" href={c.reportUrl} target="_blank" rel="noreferrer">
                <span className="live-dot" style={{ background: ALERT_COLOR[c.alertLevel] || "#888" }} />
                <span className="live-name">{c.name}</span>
                <span className="live-meta">
                  {c.country}{isNearIndia(c) && <b className="live-india"> · near India</b>}
                </span>
              </a>
            ))
          )}
          <p className="note">
            Source: Global Disaster Awareness and Coordination System (GDACS). This shows whether a cyclone
            currently exists and its rough location — it is not a forecast or an official warning. For official
            Indian cyclone warnings, always follow IMD and NDMA.
          </p>
          {updatedAt && (
            <p className="muted small">
              Last checked: {updatedAt.toLocaleTimeString()}{" "}
              <button className="live-refresh" onClick={reload}>↻ refresh</button>
            </p>
          )}
        </>
      )}
    </Card>
  );
}