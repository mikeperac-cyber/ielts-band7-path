import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ielts-band7-path.vercel.app";
  return ["", "/sample/day-1", "/sign-in"].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: "weekly", priority: path === "" ? 1 : 0.8 }));
}
