import Link from "next/link";
import Image from "next/image";
import { SERVICE_LINKS } from "@/lib/constants";
import { IMAGES, type ImageKey } from "@/lib/images";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { ArrowRight } from "lucide-react";

export function ServicesSection() {
  return (
    <Section className="gradient-premium !py-16 md:!py-24">
      <SectionHeader
        eyebrow="Our services"
        title="Everything handled — from packing to storage."
        description="Home, office and storage moves across South West London and Surrey."
        className="!mb-12 md:!mb-16 max-w-3xl"
      />

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {SERVICE_LINKS.map((service, i) => (
          <FadeIn key={service.title} delay={i * 0.05}>
            <Link href={service.href} className="block h-full group">
              <article className="h-full rounded-2xl border border-border/80 bg-white overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] hover:border-green-700/20 transition-all duration-500">
                <div className="grid sm:grid-cols-[1.1fr_1fr] h-full">
                  <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[220px] overflow-hidden">
                    <Image
                      src={IMAGES[service.imageKey as ImageKey]}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-7 md:p-9">
                    <h3 className="font-display text-2xl md:text-[1.65rem] font-semibold text-charcoal tracking-tight group-hover:text-green-800 transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm md:text-base text-charcoal-light leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-green-800">
                      View service
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
