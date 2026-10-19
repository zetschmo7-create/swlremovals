import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { createMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { organizationReference } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/templates/PageHero";
import { Section } from "@/components/ui/Section";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return {};
  const metadata = createMetadata({ title: post.title, description: post.description, path: `/blog/${post.slug}`, ogImage: post.featureImage, ogImageAlt: post.featureAlt });
  return { ...metadata, title: { absolute: post.title }, openGraph: { ...metadata.openGraph, title: post.title, type: "article", publishedTime: post.publishedDate } };
}

export default async function BlogArticlePage({ params }: Props) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.description, datePublished: post.publishedDate, image: post.featureImage, author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL }, publisher: organizationReference(), mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`, inLanguage: "en-GB" }} />
    <PageHero eyebrow="Moving advice" title={post.title} />
    <Section>
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-charcoal-light"><Link className="underline" href="/">Home</Link> / <Link className="underline" href="/blog">Moving advice</Link> / <span>{post.title}</span></nav>
        <p className="mb-10 text-sm text-charcoal-muted">Published <time dateTime={post.publishedDate}>{new Date(`${post.publishedDate}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" })}</time> by {SITE_NAME}</p>
        {/* Reviewed repository content, never request input. Validate before committing. */}
        <article className="article-content" data-distribb-article-id={post.articleId} dangerouslySetInnerHTML={{ __html: post.content }} />
        <p className="mt-12 border-t border-border pt-6"><Link href="/blog" className="text-green-800 underline">More moving advice</Link></p>
      </div>
    </Section>
  </>;
}
