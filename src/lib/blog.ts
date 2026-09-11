import {
  blogPosts,
  BlogPost,
  getPostBySlug,
  getAllPosts,
} from "@/data/blog-posts";

export { getAllPosts, getPostBySlug, type BlogPost };

export function getRelatedPosts(currentSlug: string, count = 2): BlogPost[] {
  return blogPosts.filter((p) => p.slug !== currentSlug).slice(0, count);
}

export function getAllCategories(): string[] {
  const categories = new Set(blogPosts.map((p) => p.category));
  return Array.from(categories);
}
