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

  return (
    <>
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} description={page.hero.description} />

      <section className="py-16 sm:py-20">
        <Container className="space-y-10">
          <SectionHeading eyebrow={page.section.eyebrow} title={page.section.title} description={page.section.description} />
          <VideoGrid videos={videos} />
        </Container>
      </section>
    </>
  );
}
