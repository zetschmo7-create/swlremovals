import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const directory = new URL("../src/content/blog/", import.meta.url);
const ids = new Set();
const slugs = new Set();
const banned = /\b(delve|dive into|leverage|unlock|game-changer|seamless|robust|comprehensive|crucial|pivotal|elevate|empower|landscape|realm)\b|in today's digital world/iu;
for (const file of readdirSync(directory).filter((name) => name.endsWith(".json"))) {
  const post = JSON.parse(readFileSync(new URL(file, directory), "utf8"));
  const body = post.content;
  assert(!ids.has(post.articleId) && !slugs.has(post.slug), "Duplicate article ID or slug");
  ids.add(post.articleId); slugs.add(post.slug);
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug), "Invalid slug");
  assert(post.title.length < 60 && !/ultimate|complete guide/i.test(post.title), "Invalid article title");
  assert(post.description.length >= 140 && post.description.length <= 170, "Check meta description length");
  assert(post.featureImage.startsWith("https://") && post.featureAlt.trim(), "Missing feature artwork");
  assert(!/<\/?(?:html|head|body|script|style|h1)\b/i.test(body), "Body must be an HTML fragment");
  assert(!/\son[a-z]+\s*=|(?:href|src)\s*=\s*["']\s*(?:javascript:|data:)/i.test(body), "Executable HTML is forbidden");
  const text = body.replace(/<[^>]*>/g, " ").replace(/&[^;]+;/g, " ");
  assert(!banned.test(text) && !text.includes("\u2014"), "Banned wording");
  const words = text.trim().split(/\s+/).length;
  const target = post.wordTarget;
  assert(target && words >= target * 0.85 && words <= target * 1.25, `Word count ${words} outside brief target`);
  const headings = [...body.matchAll(/<h2\b[^>]*\bid="([^"]+)"/gi)].map((match) => match[1]);
  assert(headings.length === (body.match(/<h2\b/gi) || []).length && new Set(headings).size === headings.length, "H2 IDs missing or duplicated");
  const toc = [...body.matchAll(/<nav\b[^>]*class="[^"]*table-of-contents[^"]*"[^>]*>([\s\S]*?)<\/nav>/gi)];
  assert(toc.length === 1, "Exactly one table of contents required");
  const tocTargets = [...toc[0][1].matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  assert(headings.length === tocTargets.length && tocTargets.every((id) => headings.includes(id)), "TOC links must resolve to every H2");
  assert(/frequently asked questions|common questions/i.test(text), "FAQ missing");
  const sources = [...body.matchAll(/href="(https:[^"]+)"/g)].map((match) => match[1]);
  assert(new Set(sources.filter((url) => new URL(url).hostname.endsWith(".gov.uk"))).size >= 2, "Review authority sources");
  for (const link of post.requiredLinks || []) {
    assert(body.includes(`href="${link.url}"`) && body.includes(link.anchor), "Required brief link missing");
  }
  const images = [...body.matchAll(/<img\b[^>]*>/gi)];
  assert(images.length >= 2 && images.every(([tag]) => /alt="[^"]+"/.test(tag) && /src="https:\/\//.test(tag)), "Images require hosted URLs and alt text");
  console.log(`Article ${post.articleId}: ${words} words, ${headings.length} headings, ${images.length} images; validation passed`);
}
