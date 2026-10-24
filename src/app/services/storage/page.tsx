import { createMetadata } from "@/lib/seo";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";
import { StorageSeoContent } from "@/components/services/StorageSeoContent";
import { IMAGES } from "@/lib/images";

export const metadata = createMetadata({
  title: "Removals and Storage South West London | SWL Removals",
  description:
    "Short and long-term storage alongside your removal across South West London and Surrey. Ideal for chain delays, renovations and downsizing. Get a quote.",
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
        "Collection and delivery planning",
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
            "Ask us to confirm in writing what cover applies to your stored belongings, including any limits, exclusions and conditions, before booking. Check your own contents policy too.",
        },
        {
          question: "Can you collect and deliver to storage?",
          answer:
            "We can arrange collection from your property and delivery from storage. Confirm the dates, access arrangements and any charges in your written quotation before booking.",
        },
      ]}
      extraContent={<StorageSeoContent />}
    />
  );
}
