import { createMetadata } from "@/lib/seo";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";
import { IMAGES } from "@/lib/images";

export const metadata = createMetadata({
  title: "House Removals",
  description:
    "Premium house removals across South West London and Surrey. Fixed quotations, trained crews, and careful handling for every home.",
  path: "/services/house-removals",
  ogImage: IMAGES.movingDay,
  keywords: ["house removals", "home removals Wimbledon", "family home move"],
});

export default function HouseRemovalsPage() {
  return (
    <ServicePageTemplate
      path="/services/house-removals"
      title="House Removals"
      description="Careful, professional home moves across South West London, Surrey and beyond. Fixed quotations. Experienced crews."
      intro="Moving home should feel managed, not chaotic. Our house removals service covers everything from studio flats to large family properties — with floor protection, furniture wrapping, and crews who understand the access challenges of period homes, mansion blocks, and modern developments alike."
      features={[
        "Fixed quotation agreed before moving day",
        "Floor and banister protection as standard",
        "Furniture wrapping and careful handling",
        "Trained in-house crews — not agency staff",
        "Full inventory and methodical loading",
        "Disassembly and reassembly of furniture",
        "Coverage across South West London and Surrey",
        "Long-distance moves available nationwide",
      ]}
      faqs={[
        {
          question: "How much does a house removal cost?",
          answer:
            "Costs depend on property size, volume, distance, and access. We provide fixed quotations after survey or WhatsApp walkthrough — no hidden extras.",
        },
        {
          question: "Do you move large family homes?",
          answer:
            "Yes. We regularly handle four, five, and six-bedroom properties with appropriately sized crews and vehicles.",
        },
        {
          question: "Can you help with a chain move?",
          answer:
            "Yes. We offer flexible scheduling and storage solutions to accommodate property chains.",
        },
      ]}
    />
  );
}
