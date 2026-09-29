import { DRIVERS } from "../../data/profiles";
import { getRiskLevel } from "../../constants/risk";

export default function DriverBars({ drivers }) {
  return (
    <div>
      {DRIVERS.map((d) => {
        const v = drivers[d.id];
        return (
          <div className="row" key={d.id}>
            <div className="row-h"><span>{d.label}</span><b>{v}</b></div>
            <div className="bar"><i style={{ width: `${v}%`, background: getRiskLevel(v).color }} /></div>
          </div>
        );
      })}
    </div>
  );
}