import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STORIES, getStory } from "@/lib/data";
import { MODEL_BY_ID } from "@/lib/models";
import Strands from "@/components/Strands";
import DivergenceTag from "@/components/DivergenceTag";
import TakeList from "@/components/TakeList";

export function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }));
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  return (
    <div className="page">
      <header className="article-header rise">
        <span className="eyebrow">
          <Link href={`/section/${story.section}`}>{story.section}</Link> ·{" "}
          {story.displayDate}
        </span>
        <h1 style={{ marginTop: 12 }}>{story.headline}</h1>
        <p className="dek" style={{ fontSize: 18, marginTop: 16 }}>
          {story.dek}
        </p>
        <div className="byline" style={{ marginTop: 20 }}>
          <Strands takes={story.takes} width={150} height={48} />
          <DivergenceTag value={story.divergence} />
        </div>
      </header>

      <Image
        src={story.image}
        alt={story.imageAlt}
        width={1600}
        height={900}
        className="story-img"
        style={{ margin: "32px 0", maxHeight: 460, objectFit: "cover" }}
        priority
      />

      <div className="crux">
        <span className="crux-label">The crux — what the panel is split on</span>
        <p>{story.crux}</p>
      </div>

      <div className="article-body">
        {story.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <p className="mono" style={{ marginTop: 24, color: "var(--ink-3)" }}>
        Lead report by {MODEL_BY_ID["claude"].name} · Sources:{" "}
        {story.sources.join(", ")}
      </p>

      <TakeList story={story} />
    </div>
  );
}
