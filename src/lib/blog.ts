import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export type BlogPost = {
  articleId: number;
  slug: string;
  title: string;
  description: string;
  publishedDate: string;
  sourceModifiedAt: string;
  featureImage: string;
  featureAlt: string;
  content: string;
};

/** Only reviewed, deliberately published records belong in this directory. */
export function getBlogPosts(): BlogPost[] {
  const directory = path.join(process.cwd(), "src/content/blog");
  return readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(readFileSync(path.join(directory, file), "utf8")) as BlogPost)
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
}

export function getBlogPost(slug: string) {
  return getBlogPosts().find((post) => post.slug === slug);
}
