import Link from "next/link";

const linkClass =
  "font-medium text-green-800 hover:text-green-900 underline-offset-2 hover:underline";

export function OfficeRemovalsSeoContent() {
  return (
    <div className="space-y-12 max-w-3xl">
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          Office relocations with minimal disruption
        </h2>
        <p className="text-lg text-charcoal-light leading-relaxed">
          An office move is a project, not just a van trip. We plan the move
          around your working hours, including evenings and weekends, so your
          team loses as little time as possible. We work with small offices and
          teams across{" "}
          <Link href="/areas-covered" className={linkClass}>
            South West London
          </Link>
          , Central London and Surrey.
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          How we plan an office move
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-charcoal-light leading-relaxed">
          <li>
            Tell us your current and new addresses, how many desks and rooms, and
            your preferred date.
          </li>
          <li>We review access, lifts, loading and parking at both ends.</li>
          <li>You receive a fixed quotation.</li>
          <li>
            We label and move furniture, equipment and archive boxes to agreed
            positions at the new office.
          </li>
        </ol>
      </div>

      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          What to prepare before moving day
        </h2>
        <p className="text-lg text-charcoal-light leading-relaxed">
          Appoint one person to coordinate with us, label desks and rooms, and
          let your IT provider know the date so equipment is disconnected and
          reconnected properly. Confirm lift booking and parking with both
          buildings.
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          Office removals FAQ
        </h2>
        <ul className="space-y-4 text-charcoal-light leading-relaxed">
          <li>
            <em className="not-italic font-medium text-charcoal">
              Can you move at the weekend?
            </em>{" "}
            Yes, evenings and weekends are available. Ask when you request your
            quote.
          </li>
          <li>
            <em className="not-italic font-medium text-charcoal">
              Do you provide packing materials?
            </em>{" "}
            We can supply{" "}
            <Link href="/services/packing" className={linkClass}>
              packing
            </Link>{" "}
            for files, equipment and fragile items.
          </li>
          <li>
            <em className="not-italic font-medium text-charcoal">
              Can you store furniture between offices?
            </em>{" "}
            Yes, through our{" "}
            <Link href="/services/storage" className={linkClass}>
              storage
            </Link>{" "}
            service.
          </li>
        </ul>
      </div>
    </div>
  );
}
