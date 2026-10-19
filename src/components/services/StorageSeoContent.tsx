import Link from "next/link";

const linkClass =
  "font-medium text-green-800 hover:text-green-900 underline-offset-2 hover:underline";

export function StorageSeoContent() {
  return (
    <div className="space-y-12 max-w-3xl">
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          Storage to fit your move
        </h2>
        <p className="text-lg text-charcoal-light leading-relaxed">
          Chain delays, renovations and downsizing all create a gap between
          leaving one home and entering the next. We offer short and long-term
          storage to cover that gap, alongside your{" "}
          <Link href="/services/house-removals" className={linkClass}>
            house removal
          </Link>{" "}
          or{" "}
          <Link href="/services/office-removals" className={linkClass}>
            office move
          </Link>
          .
        </p>
        {/* CONFIRM WITH OWNER: storage type (warehouse vs containers), access arrangements, security features, insurance cover. Add only once supplied; do not guess. */}
      </div>

      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          When storage helps
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-charcoal-light leading-relaxed">
          <li>Your sale and purchase dates do not line up.</li>
          <li>You are renovating and need rooms cleared.</li>
          <li>You are downsizing and need time to decide what to keep.</li>
          <li>You are moving between offices.</li>
        </ul>
      </div>

      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          How it works
        </h2>
        <p className="text-lg text-charcoal-light leading-relaxed">
          Tell us what you need to store and for roughly how long when you
          request a quote. We collect, move and store your belongings, and can
          deliver them to your new address when you are ready.
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          Storage FAQ
        </h2>
        <ul className="space-y-4 text-charcoal-light leading-relaxed">
          <li>
            <em className="not-italic font-medium text-charcoal">
              How long can I store my belongings?
            </em>{" "}
            Short and long-term options are available; tell us your expected
            dates.
          </li>
          <li>
            <em className="not-italic font-medium text-charcoal">
              Can I combine storage with packing?
            </em>{" "}
            Yes. See our{" "}
            <Link href="/services/packing" className={linkClass}>
              packing services
            </Link>
            .
          </li>
          <li>
            <em className="not-italic font-medium text-charcoal">
              Can you deliver from storage to my new home?
            </em>{" "}
            Yes. Tell us when you request your quote.
          </li>
        </ul>
      </div>
    </div>
  );
}
