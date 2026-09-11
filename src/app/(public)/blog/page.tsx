import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Calendar,
  ArrowRight,
  UserCheck,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { SectionWrapper } from "@/components/design-system/section-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllPosts, getAllCategories } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Health Journal & Medical Articles | HealthSphere Clinic",
  description:
    "Evidence-based clinical insights, cardiology guidance, pediatric recommendations, and preventive wellness written directly by board-certified physicians.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "HealthSphere Clinic Journal - Evidence-Based Medical Insights",
    description:
      "Actionable medical guides on heart health, childhood wellness, chronic migraine care, and oral-systemic health.",
    url: "/blog",
  },
};

export default function BlogListPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <main className="py-12 sm:py-16">
      <SectionWrapper containerSize="default" className="py-0 sm:py-0 lg:py-0">
        <div className="space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <Badge variant="default">Clinical Journal & Evidence</Badge>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-brand-text sm:text-4xl lg:text-5xl">
              Physician Insights for Your Daily Health
            </h1>
            <p className="text-base leading-relaxed text-brand-muted">
              Medical knowledge should be transparent, accessible, and grounded
              in rigorous clinical research. Explore articles authored and
              reviewed by our clinical staff.
            </p>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-brand-border pb-4">
            <span className="mr-2 text-xs font-semibold text-brand-muted">
              Categories:
            </span>
            <Badge variant="default" className="cursor-pointer">
              All Topics
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className="hover:bg-brand-accent/20 cursor-pointer"
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <Card
                key={post.slug}
                className="hover:border-brand-primary/40 group flex flex-col justify-between transition-all duration-200 hover:shadow-lg"
              >
                <CardContent className="space-y-4 p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-2.5 font-heading text-xl font-bold leading-snug text-brand-text transition-colors group-hover:text-brand-primary">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="line-clamp-3 text-xs leading-relaxed text-brand-muted sm:text-sm">
                      {post.summary}
                    </p>
                  </div>

                  {/* Author Bar */}
                  <div className="border-brand-border/60 flex items-center justify-between border-t pt-3">
                    <div className="space-y-0.5">
                      <span className="block font-heading text-xs font-semibold text-brand-text">
                        {post.author.name}
                      </span>
                      <span className="block text-[11px] text-brand-muted">
                        {post.author.role}
                      </span>
                    </div>
                    <span className="text-[11px] text-brand-muted">
                      {post.publishedAt}
                    </span>
                  </div>
                </CardContent>

                <div className="p-6 pt-0 sm:p-8">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1.5 text-xs"
                    >
                      <span>Read Medical Article</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </main>
  );
}
