import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";

export function Testimonials() {
  return (
    <Section className="!py-20 md:!py-28">
      <SectionHeader
        eyebrow="Client feedback"
        title="Trusted by homeowners who expect more."
        align="center"
        className="!mb-12 md:!mb-16 max-w-2xl mx-auto"
      />

      <FadeIn>
        <TestimonialsCarousel />
      </FadeIn>
    </Section>
  );
}
