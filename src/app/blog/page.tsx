import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";
import { createMetadata } from "@/lib/seo";
import { PageHero } from "@/components/templates/PageHero";
import { Section } from "@/components/ui/Section";

export const metadata = createMetadata({
  title: "Moving advice",
  description: "Moving advice for Wimbledon, South West London and Surrey: compare quotations, plan access, prepare packing and organise your next move.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getBlogPosts();
  return <>
    <PageHero eyebrow="Moving advice" title="Plan your next move" description="Useful checks and planning advice from South West London Removals." />
    <Section>
      <p className="max-w-3xl mb-10 text-charcoal-light">For an assessment of your inventory and access, visit our <Link className="underline text-green-800" href="/wimbledon-removals">Wimbledon removals service</Link>. These articles answer separate planning questions to help you prepare.</p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => <article key={post.articleId} className="overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-soft)]">
          <Link href={`/blog/${post.slug}`} className="block">
            {/* Already hosted article artwork. Dimensions reserve layout space. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.featureImage} alt={post.featureAlt} width="1536" height="1024" className="aspect-[3/2] w-full object-cover" loading="lazy" />
            <div className="p-6">
              <time dateTime={post.publishedDate} className="text-sm text-charcoal-muted">{new Date(`${post.publishedDate}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" })}</time>
              <h2 className="mt-3 font-display text-2xl font-semibold text-green-900">{post.title}</h2>
              <p className="mt-4 text-charcoal-light">{post.description}</p>
            </div>
          </Link>
        </article>)}
      </div>
    </Section>
  </>;
}
