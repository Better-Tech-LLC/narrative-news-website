import { TICKER } from "@/lib/data";

export default function Ticker() {
  return (
    <div className="ticker" role="complementary" aria-label="Market snapshot">
      <div className="page ticker-inner">
        {TICKER.map((t) => (
          <span className="tick" key={t.label}>
            <span className="tick-label">{t.label}</span>
            <span className="tick-val">{t.value}</span>
            <span className={t.change >= 0 ? "tick-up" : "tick-down"}>
              {t.change >= 0 ? "▲" : "▼"} {Math.abs(t.change).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
