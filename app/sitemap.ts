import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/siteContent";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/sports", "/pricing", "/memberships", "/videos", "/contact", "/privacy-policy", "/terms-of-use"];

  return routes.map((route) => ({
    url: `${siteConfig.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/videos" ? 0.7 : 0.8,
  }));
}
