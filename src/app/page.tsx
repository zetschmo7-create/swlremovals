import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";
import { TrustSection } from "@/components/home/TrustSection";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { ServicesSection } from "@/components/home/ServicesSection";
import { OperationalTrust } from "@/components/home/OperationalTrust";

const Testimonials = dynamic(() =>
  import("@/components/home/Testimonials").then((mod) => mod.Testimonials)
);
const AccreditationSection = dynamic(() =>
  import("@/components/home/AccreditationSection").then(
    (mod) => mod.AccreditationSection
  )
);
const AreasPreview = dynamic(() =>
  import("@/components/home/AreasPreview").then((mod) => mod.AreasPreview)
);
const HomeFAQ = dynamic(() =>
  import("@/components/home/HomeFAQ").then((mod) => mod.HomeFAQ)
);
const CTABanner = dynamic(() =>
  import("@/components/home/CTABanner").then((mod) => mod.CTABanner)
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <BeforeAfter />
      <ServicesSection />
      <OperationalTrust />
      <Testimonials />
      <AccreditationSection />
      <AreasPreview />
      <HomeFAQ />
      <CTABanner />
    </>
  );
}
