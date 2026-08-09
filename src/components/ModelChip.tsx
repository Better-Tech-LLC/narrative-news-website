import Link from "next/link";
import type { PanelModel } from "@/lib/types";

export default function ModelChip({ model }: { model: PanelModel }) {
  return (
    <Link href={`/models/${model.id}`} className="model-chip">
      <i style={{ background: model.hue }} aria-hidden="true" />
      {model.name}
    </Link>
  );
}
