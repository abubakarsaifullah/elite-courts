import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { VideoGrid } from "@/components/videos/video-grid";
import { pageContent } from "@/data/siteContent";
import { videos } from "@/data/videos";

export const metadata = buildMetadata({
  title: pageContent.videos.metadataTitle,
  description: pageContent.videos.metadataDescription,
  path: "/videos",
});

export default function VideosPage() {
  const page = pageContent.videos;
  const youtubeVideos = videos.filter((video) => video.platform === "youtube");
  const tikTokVideos = videos.filter((video) => video.platform === "tiktok");

  return (
    <>
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} description={page.hero.description} />

      <section className="py-16 sm:py-20">
        <Container className="space-y-10">
          <SectionHeading eyebrow={page.section.eyebrow} title={page.section.title} description={page.section.description} />

          <div className="space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--text)] sm:text-3xl">YouTube Videos</h2>
            <VideoGrid videos={youtubeVideos} columnsClassName="grid gap-6 md:grid-cols-2" />
          </div>

          <div className="space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--text)] sm:text-3xl">TikTok Videos</h2>
            <VideoGrid videos={tikTokVideos} columnsClassName="grid gap-6 md:grid-cols-2 xl:grid-cols-3" />
          </div>
        </Container>
      </section>
    </>
  );
}
