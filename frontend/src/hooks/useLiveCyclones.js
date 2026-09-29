import { useCallback, useEffect, useState } from "react";
import { fetchLiveCyclones } from "../services/gdacsService";

// status: "loading" | "ready" | "error"
export default function useLiveCyclones() {
  const [state, setState] = useState({ status: "loading", cyclones: [], updatedAt: null, error: null });

  const load = useCallback(() => {
    setState((s) => ({ ...s, status: "loading" }));
    fetchLiveCyclones()
      .then((cyclones) => setState({ status: "ready", cyclones, updatedAt: new Date(), error: null }))
      .catch((err) => {
        console.warn("GDACS fetch failed:", err.message);
        setState({ status: "error", cyclones: [], updatedAt: null, error: err.message });
      });
  }, []);

  useEffect(() => { load(); }, [load]);
  return { ...state, reload: load };
}