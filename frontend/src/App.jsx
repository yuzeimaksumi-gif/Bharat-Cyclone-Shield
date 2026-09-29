import { useMemo, useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import OverviewView from "./views/OverviewView";
import MapView from "./views/MapView";
import RegionalView from "./views/RegionalView";
import PlaceholderView from "./views/PlaceholderView";
import InfraView from "./views/InfraView";
import CompareView from "./views/CompareView";
import PrepareView from "./views/PrepareView";

import { NAV_ITEMS } from "./constants/navigation";
import { DEFAULT_DRAFT } from "./constants/scenario";
import { computeRisk } from "./engine/risk"; 

// Defined ONCE at top level with all available views registered
const VIEWS = { 
  overview: OverviewView, 
  map: MapView, 
  regional: RegionalView,
  infra: InfraView,
  compare: CompareView,
  prepare: PrepareView
};

export default function App() {
  const [active, setActive] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Simulator state shared by all views: draft = controls, scenario = last analyzed run.
  const [draft, setDraft] = useState(DEFAULT_DRAFT);
  const [scenario, setScenario] = useState(null);
  const result = useMemo(() => (scenario ? computeRisk(scenario) : null), [scenario]);
  const sim = { draft, setDraft, scenario, result, run: () => setScenario({ ...draft }) };

  const item = NAV_ITEMS.find((n) => n.id === active);
  
  // Safely grab the component for the active view, fallback to PlaceholderView
  const View = VIEWS[active] ?? PlaceholderView;

  return (
    <div className="app">
      <Sidebar active={active} onSelect={setActive} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main">
        <Header item={item} onMenu={() => setMenuOpen(true)} />
        <div className={`content bg-${active}`}>
          <View item={item} selectedId={selectedId} onSelect={setSelectedId} sim={sim} />
        </div>
      </div>
    </div>
  );
}