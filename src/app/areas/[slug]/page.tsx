import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { AREAS, getAreaBySlug } from "@/lib/areas";
import { AreaPageTemplate } from "@/components/templates/AreaPageTemplate";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return AREAS.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) return {};

  return createMetadata({
    title: area.title,
    description: area.description,
    path: `/areas/${area.slug}`,
    keywords: [
      `${area.name} removals`,
      `removals ${area.name}`,
      `house removals ${area.name}`,
    ],
  });
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) notFound();

  return <AreaPageTemplate area={area} />;
}
