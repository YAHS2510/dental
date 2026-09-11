import { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { clinicalServices } from "@/data/services-data";
import { blogPosts } from "@/data/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || "https://healthsphere.example.com";
  const lastModified = new Date();

  // Static public pages
  const staticPages = [
    "",
    "/services",
    "/about",
    "/blog",
    "/contact",
    "/book",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority:
      route === ""
        ? 1.0
        : route === "/services" || route === "/book"
          ? 0.9
          : 0.8,
  }));

  // Dynamic clinical service pages
  const servicePages = clinicalServices.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Dynamic health blog articles
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...blogPages];
}
