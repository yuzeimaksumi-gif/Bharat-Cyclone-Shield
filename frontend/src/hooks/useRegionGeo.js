import { useEffect, useState } from "react";
import { loadRegionGeo } from "../services/geoService";

// status: "loading" | "ready" | "error"
export default function useRegionGeo() {
  const [state, setState] = useState({ geo: null, status: "loading" });
  useEffect(() => {
    loadRegionGeo()
      .then((geo) => setState({ geo, status: "ready" }))
      .catch((err) => {
        console.warn("Region GeoJSON unavailable, using fallback circles:", err.message);
        setState({ geo: null, status: "error" });
      });
  }, []);
  return state;
}