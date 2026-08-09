import { PANEL, modelHue } from "@/lib/models";
import type { ModelTake } from "@/lib/types";

interface StrandsProps {
  /** Takes whose positions drive the splay. Order follows PANEL order. */
  takes?: ModelTake[];
  width?: number;
  height?: number;
  /** Ambient hero variant: no data, gentle drift */
  ambient?: boolean;
  className?: string;
}

/**
 * The signature mark: six strands, one per model.
 * Parallel where the panel agrees, splayed where it diverges.
 */
export default function Strands({
  takes,
  width = 120,
  height = 44,
  ambient = false,
  className,
}: StrandsProps) {
  const mid = height / 2;
  const spread = height * 0.44;

  const strands = PANEL.map((model, i) => {
    const take = takes?.find((t) => t.modelId === model.id);
    // Ambient fallback: a fixed, calm splay
    const pos = take
      ? take.position
      : [(0.5), (-0.3), (0.15), (0.7), (-0.6), (-0.05)][i];
    const y2 = mid + pos * spread;
    const d = `M 0 ${mid.toFixed(1)} C ${(width * 0.45).toFixed(1)} ${mid.toFixed(1)}, ${(width * 0.6).toFixed(1)} ${y2.toFixed(1)}, ${width} ${y2.toFixed(1)}`;
    return { d, hue: modelHue(model.id), id: model.id };
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      fill="none"
      aria-hidden="true"
      className={`fingerprint ${ambient ? "drift" : ""} ${className ?? ""}`}
    >
      {strands.map((s, i) => (
        <path
          key={s.id}
          d={s.d}
          stroke={s.hue}
          strokeWidth={ambient ? 2 : 1.6}
          strokeLinecap="round"
          opacity={0.92}
          style={ambient ? { animationDelay: `${i * -1.4}s` } : undefined}
        />
      ))}
    </svg>
  );
}
