import { createMetadata } from "@/lib/seo";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";
import { IMAGES } from "@/lib/images";

export const metadata = createMetadata({
  title: "Office Removals",
  description:
    "Discreet, efficient office removals across South West London. Minimal disruption, professional crews, fixed quotations.",
  path: "/services/office-removals",
  ogImage: IMAGES.officeMove,
  keywords: ["office removals", "commercial relocation London"],
});

export default function OfficeRemovalsPage() {
  return (
    <ServicePageTemplate
      path="/services/office-removals"
      title="Office Removals"
      description="Discreet commercial relocations with minimal business disruption. Planned, efficient, and handled properly."
      intro="Office moves demand precision and discretion. Whether you are relocating a small professional practice or a multi-floor commercial space, we plan every detail — from IT equipment handling to out-of-hours scheduling — so your business experiences minimal downtime."
      features={[
        "Out-of-hours and weekend moves available",
        "IT equipment and sensitive document handling",
        "Labelled packing and systematic relocation",
        "Floor plans and desk mapping",
        "Minimal disruption to operations",
        "Fully insured commercial removals",
        "Fixed quotation with clear scope",
        "Experienced project coordination",
      ]}
      faqs={[
        {
          question: "Can you move offices outside business hours?",
          answer:
            "Yes. Evening and weekend moves are standard for commercial clients to minimise disruption.",
        },
        {
          question: "Do you handle IT equipment?",
          answer:
            "Yes. We work with labelled packing systems and can coordinate with your IT team for sensitive equipment.",
        },
        {
          question: "How far in advance should we book?",
          answer:
            "We recommend four to six weeks for larger commercial moves, though shorter timelines can often be accommodated.",
        },
      ]}
    />
  );
}
