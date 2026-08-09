export function divergenceLabel(value: number): string {
  if (value >= 0.7) return "High divergence";
  if (value >= 0.45) return "Split panel";
  if (value >= 0.25) return "Leaning consensus";
  return "Consensus";
}

export default function DivergenceTag({ value }: { value: number }) {
  return (
    <span className="divergence-tag">
      Δ <b>{value.toFixed(2)}</b> · {divergenceLabel(value)}
    </span>
  );
}
