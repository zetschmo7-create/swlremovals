import { BEFORE_AFTER_ITEMS } from "@/lib/constants";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";

export function BeforeAfter() {
  return (
    <Section className="!py-16 md:!py-24">
      <SectionHeader
        eyebrow="How we work"
        title="Every detail handled before the first item leaves the room."
        description="Protection down, furniture wrapped, loading planned."
        className="!mb-10 md:!mb-14 max-w-3xl"
        titleClassName="max-lg:text-[1.65rem] max-lg:leading-snug"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {BEFORE_AFTER_ITEMS.map((item, i) => (
          <FadeIn key={item.title} delay={i * 0.06}>
            <div className="relative pt-6 border-t border-border">
              <span className="font-display text-4xl md:text-5xl font-semibold text-green-800/15 absolute -top-1 left-0 leading-none select-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-green-700 mb-3">
                {item.tag}
              </p>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-charcoal tracking-tight mb-2">
                {item.title}
              </h3>
              <p className="text-sm md:text-base text-charcoal-light leading-relaxed">
                {item.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
