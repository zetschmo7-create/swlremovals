import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { MOVEFLOW_REVIEWS } from "@/data/moveflowReviews";

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

      {/* Server-rendered review text for crawlers (name, route, quote) */}
      <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {MOVEFLOW_REVIEWS.slice(0, 6).map((review) => (
          <blockquote
            key={review.id}
            className="rounded-2xl border border-border bg-white p-5 md:p-6"
          >
            <p className="text-charcoal-light leading-relaxed">
              &ldquo;{review.quote}&rdquo;
            </p>
            <footer className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-charcoal">{review.name}</p>
              <p className="text-xs text-charcoal-muted mt-1">
                {review.locationRoute}
              </p>
            </footer>
          </blockquote>
        ))}
      </div>
    </Section>
  );
}
