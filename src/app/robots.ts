import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard", "/tracker", "/error-log", "/settings"] }, sitemap: "https://ielts-band7-path.vercel.app/sitemap.xml" };
}
