import Link from "next/link";
import Image from "next/image";
import type { Story } from "@/lib/types";
import Strands from "./Strands";
import DivergenceTag from "./DivergenceTag";

interface StoryCardProps {
  story: Story;
  size?: "lead" | "medium" | "small";
  showImage?: boolean;
}

export default function StoryCard({
  story,
  size = "medium",
  showImage = false,
}: StoryCardProps) {
  const headlineClass =
    size === "lead"
      ? "headline headline-xl"
      : size === "medium"
        ? "headline headline-lg"
        : "headline headline-md";

  return (
    <Link href={`/story/${story.slug}`} className="story-card">
      {showImage && (
        <Image
          src={story.image}
          alt={story.imageAlt}
          width={1600}
          height={900}
          className="story-img"
          style={{ marginBottom: 18 }}
          priority={size === "lead"}
        />
      )}
      <span className="eyebrow">{story.section}</span>
      <h3 className={headlineClass} style={{ marginTop: 8 }}>
        {story.headline}
      </h3>
      {size !== "small" && <p className="dek">{story.dek}</p>}
      <div className="byline">
        <Strands takes={story.takes} width={size === "lead" ? 130 : 96} height={size === "lead" ? 44 : 34} />
        <DivergenceTag value={story.divergence} />
      </div>
    </Link>
  );
}
