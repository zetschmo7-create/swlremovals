import { createMetadata } from "@/lib/seo";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";
import { IMAGES } from "@/lib/images";

export const metadata = createMetadata({
  title: "Storage",
  description:
    "Secure storage solutions for South West London removals. Short and long-term storage for chain moves and downsizing.",
  path: "/services/storage",
  ogImage: IMAGES.storage,
  keywords: ["storage removals", "furniture storage London"],
});

export default function StoragePage() {
  return (
    <ServicePageTemplate
      path="/services/storage"
      title="Storage"
      description="Secure short and long-term storage. Ideal for chain moves, renovations, and downsizing."
      intro="Not every move aligns perfectly. Whether you are in a property chain, renovating, or downsizing, our storage service keeps your belongings secure and accessible until you are ready — with the same careful handling standards we apply to every move."
      features={[
        "Secure, monitored storage facilities",
        "Short and long-term options",
        "Collection and delivery included",
        "Inventory tracking",
        "Ideal for property chains",
        "Climate-appropriate storage",
        "Flexible access arrangements",
        "Combined with removals for seamless service",
      ]}
      faqs={[
        {
          question: "How long can I store my belongings?",
          answer:
            "From a few weeks to several months — we offer flexible terms to suit chain moves and renovations.",
        },
        {
          question: "Are my items insured in storage?",
          answer:
            "Yes. Full insurance coverage applies during storage as part of our removals service.",
        },
        {
          question: "Can you collect and deliver to storage?",
          answer:
            "Yes. Collection from your property and delivery when you are ready is all part of the service.",
        },
      ]}
    />
  );
}
