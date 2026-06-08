import { createMetadata } from "@/lib/seo";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export const metadata = createMetadata({
  title: "Packing Services",
  description:
    "Professional packing services for South West London moves. Premium materials, careful labelling, full or partial packing.",
  path: "/services/packing",
  keywords: ["packing service", "professional packers London"],
});

export default function PackingPage() {
  return (
    <ServicePageTemplate
      title="Packing Services"
      description="Professional packing with premium materials. Full, partial, or fragile-only — handled with care."
      intro="Proper packing is the foundation of a stress-free move. Our packing teams use quality materials, systematic labelling, and the experience to know how valuable and fragile items should be protected — from fine china to artwork and electronics."
      features={[
        "Full home packing service",
        "Partial packing (kitchen, fragile items)",
        "Premium packing materials included",
        "Clear room-by-room labelling",
        "Fragile item specialist packing",
        "Wardrobe boxes for clothing",
        "Can be scheduled before moving day",
        "Unpacking service available",
      ]}
      faqs={[
        {
          question: "Do you provide packing materials?",
          answer:
            "Yes. All materials are included — boxes, bubble wrap, tissue paper, wardrobe boxes, and protective covers.",
        },
        {
          question: "Can you pack just the kitchen or fragile items?",
          answer:
            "Yes. Partial packing is popular — we can focus on specific rooms or fragile categories.",
        },
        {
          question: "How long does packing take?",
          answer:
            "A full three-bedroom home typically takes one day. We assess timing during your quotation.",
        },
      ]}
    />
  );
}
