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
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "sports facility",
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
        { url: "/icon.svg", sizes: "32x32", type: "image/svg+xml" },
        { url: "/icon.svg", sizes: "64x64", type: "image/svg+xml" },
      ],
      shortcut: "/favicon.svg",
      apple: "/icon.svg",
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
