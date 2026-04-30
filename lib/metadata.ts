import type { Metadata } from "next";
import { siteConfig, siteContent } from "@/data/siteContent";

interface MetadataInput {
  title: string;
  description: string;
  path?: string;
}

export function buildMetadata({ title, description, path = "/" }: MetadataInput): Metadata {
  const canonical = new URL(path, siteConfig.siteUrl).toString();

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.siteUrl),
    alternates: {
      canonical,
    },
    applicationName: siteConfig.name,
    icons: {
      icon: "/brand/Lime-Modern-Padel-Club-Logo.jpg",
      shortcut: "/brand/Lime-Modern-Padel-Club-Logo.jpg",
      apple: "/brand/Lime-Modern-Padel-Club-Logo.jpg",
    },
    keywords: [...siteContent.seo.keywords],
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: siteConfig.name,
      locale: "en_PK",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} sports facility in Lahore`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/twitter-image"],
    },
  };
}
