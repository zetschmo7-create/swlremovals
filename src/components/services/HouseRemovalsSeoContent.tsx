import Link from "next/link";
import { PHONE, PHONE_HREF } from "@/lib/constants";

const linkClass =
  "font-medium text-green-800 hover:text-green-900 underline-offset-2 hover:underline";

export function HouseRemovalsSeoContent() {
  return (
    <div className="space-y-12 max-w-3xl">
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          Home removals across South West London and Surrey
        </h2>
        <p className="text-lg text-charcoal-light leading-relaxed">
          Whether you are moving a one-bed flat or a four-bed family home, we
          plan the move around your property. That means checking access, stairs,
          lifts and parking before the day, and agreeing a fixed quotation in
          advance. We cover{" "}
          <Link href="/wimbledon-removals" className={linkClass}>
            Wimbledon
          </Link>
          ,{" "}
          <Link href="/richmond-removals" className={linkClass}>
            Richmond
          </Link>
          ,{" "}
          <Link href="/clapham-removals" className={linkClass}>
            Clapham
          </Link>
          ,{" "}
          <Link href="/kingston-upon-thames-removals" className={linkClass}>
            Kingston
          </Link>{" "}
          and the rest of{" "}
          <Link href="/areas-covered" className={linkClass}>
            our areas
          </Link>
          .
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          How a house move works
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-charcoal-light leading-relaxed">
          <li>
            Send a WhatsApp video walkthrough, use the{" "}
            <Link href="/quote" className={linkClass}>
              online form
            </Link>{" "}
            or call{" "}
            <a href={PHONE_HREF} className={linkClass}>
              {PHONE}
            </a>
            .
          </li>
          <li>
            We review your rooms, access and parking, then send a fixed
            quotation.
          </li>
          <li>
            Choose your date. Add{" "}
            <Link href="/services/packing" className={linkClass}>
              packing
            </Link>{" "}
            or{" "}
            <Link href="/services/storage" className={linkClass}>
              storage
            </Link>{" "}
            if needed.
          </li>
          <li>
            On the day the crew protects floors and doors, wraps furniture, loads
            to a plan and unloads room by room.
          </li>
        </ol>
      </div>

      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          Furniture dismantling and reassembly
        </h2>
        <p className="text-lg text-charcoal-light leading-relaxed">
          Beds, wardrobes and larger pieces can be dismantled before loading and
          rebuilt on arrival. Tell us what needs taking apart when you request
          your quote.
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          Long-distance and nationwide moves
        </h2>
        <p className="text-lg text-charcoal-light leading-relaxed">
          We also arrange moves starting from South West London to destinations
          across the UK. Include the destination address in your quote request so
          we can plan the route and timing.
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          House removals FAQ
        </h2>
        <ul className="space-y-4 text-charcoal-light leading-relaxed">
          <li>
            <em className="not-italic font-medium text-charcoal">
              How far ahead should I book?
            </em>{" "}
            As early as you can once your date is confirmed. Contact us as soon
            as you have a date and we will tell you what is available.
          </li>
          <li>
            <em className="not-italic font-medium text-charcoal">
              Can you move me at short notice?
            </em>{" "}
            Contact us with your date and we will say whether we can help.
          </li>
          <li>
            <em className="not-italic font-medium text-charcoal">
              Is the quote fixed?
            </em>{" "}
            Yes. We base the quotation on the information and video you send, so
            tell us about anything unusual.
          </li>
        </ul>
      </div>
    </div>
  );
}
