import { Hero } from "@/components/home/Hero";
import { TrustSection } from "@/components/home/TrustSection";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { ServicesSection } from "@/components/home/ServicesSection";
import { OperationalTrust } from "@/components/home/OperationalTrust";
import { Testimonials } from "@/components/home/Testimonials";
import { AreasPreview } from "@/components/home/AreasPreview";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { CTABanner } from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <BeforeAfter />
      <ServicesSection />
      <OperationalTrust />
      <Testimonials />
      <AreasPreview />
      <HomeFAQ />
      <CTABanner />
    </>
  );
}
