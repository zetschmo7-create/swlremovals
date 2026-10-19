import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { PHONE, PHONE_HREF } from "@/lib/constants";

const linkClass =
  "font-medium text-green-800 hover:text-green-900 underline-offset-2 hover:underline";

export function WimbledonSeoContent() {
  return (
    <div className="space-y-14">
      <FadeIn>
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-6">
            Removals in Wimbledon: how a move works with us
          </h2>
          <div className="space-y-4 text-lg text-charcoal-light leading-relaxed">
            <p>
              Wimbledon moves range from Victorian terraces near the Broadway to
              flats around the station and family houses toward the Common. Every
              move starts with a fixed quotation. The quickest route is to record
              a short walkthrough of your rooms on your phone and send it to us on
              WhatsApp. We look at the furniture, access and parking, and come
              back with a fixed quotation, usually without needing an in-person
              survey. If you prefer, you can request a quote through the{" "}
              <Link href="/quote" className={linkClass}>
                online form
              </Link>{" "}
              or call{" "}
              <a href={PHONE_HREF} className={linkClass}>
                {PHONE}
              </a>
              .
            </p>
            <p>
              On the day, the crew protects floors and door frames, wraps
              furniture, loads to a plan and unloads room by room at the other
              end. We can also provide{" "}
              <Link href="/services/packing" className={linkClass}>
                packing
              </Link>{" "}
              and short or long-term{" "}
              <Link href="/services/storage" className={linkClass}>
                storage
              </Link>{" "}
              if your dates do not line up.
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-6">
            Parking and access in SW19
          </h2>
          <p className="text-lg text-charcoal-light leading-relaxed">
            Much of central Wimbledon, including the town centre and the Village,
            is covered by controlled parking zones, so a loading plan matters.
            Tell us about parking restrictions, steps, lifts, narrow stairs or
            long carries when you request your quote. If a van needs a reserved
            space outside your property, you can apply to Merton Council for a
            parking bay suspension; allow enough lead time before moving day.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-6">
            What affects the cost of a Wimbledon move
          </h2>
          <p className="text-lg text-charcoal-light leading-relaxed">
            Price depends on how much you are moving, how far, how many floors
            and how long the carry is from door to van. Dismantling and rebuilding
            furniture, packing, parking suspensions and the time of year all
            change the total. A recorded walkthrough lets us price these things
            accurately, which is why we give fixed quotations rather than rough
            estimates.
          </p>
          {/* CONFIRM WITH OWNER BEFORE SHIPPING: a table of typical price ranges by property size (1-bed flat, 2-bed, 3-bed, 4-bed+). Competitors ranking for this keyword show prices, so adding real figures would help. Do NOT publish this table with made-up numbers. */}
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-6">
            Nearby areas we move from and to
          </h2>
          <p className="text-lg text-charcoal-light leading-relaxed">
            We also cover{" "}
            <Link href="/raynes-park-removals" className={linkClass}>
              Raynes Park
            </Link>
            ,{" "}
            <Link href="/southfields-removals" className={linkClass}>
              Southfields
            </Link>
            ,{" "}
            <Link href="/putney-removals" className={linkClass}>
              Putney
            </Link>
            ,{" "}
            <Link href="/wandsworth-removals" className={linkClass}>
              Wandsworth
            </Link>
            ,{" "}
            <Link href="/kingston-upon-thames-removals" className={linkClass}>
              Kingston
            </Link>
            ,{" "}
            <Link href="/surbiton-removals" className={linkClass}>
              Surbiton
            </Link>
            ,{" "}
            <Link href="/mitcham-removals" className={linkClass}>
              Mitcham
            </Link>{" "}
            and{" "}
            <Link href="/sutton-removals" className={linkClass}>
              Sutton
            </Link>
            , as well as moves further out into{" "}
            <Link href="/areas/surrey" className={linkClass}>
              Surrey
            </Link>
            .
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-6">
            Wimbledon removals FAQ
          </h2>
          <dl className="space-y-6">
            <div>
              <dt className="font-medium text-charcoal text-base md:text-lg mb-2">
                Can I get a quote without a home survey?
              </dt>
              <dd className="text-charcoal-light leading-relaxed">
                Yes. Send a short WhatsApp video walkthrough of each room and we
                will give you a fixed quotation based on what we see.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-charcoal text-base md:text-lg mb-2">
                Do you move flats and offices in Wimbledon as well as houses?
              </dt>
              <dd className="text-charcoal-light leading-relaxed">
                Yes. We handle houses, flats and{" "}
                <Link href="/services/office-removals" className={linkClass}>
                  office moves
                </Link>{" "}
                across SW19 and the surrounding area.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-charcoal text-base md:text-lg mb-2">
                Can you pack for me?
              </dt>
              <dd className="text-charcoal-light leading-relaxed">
                Yes. We offer full or partial{" "}
                <Link href="/services/packing" className={linkClass}>
                  packing
                </Link>
                , including wardrobe boxes and careful labelling.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-charcoal text-base md:text-lg mb-2">
                What if my completion date changes?
              </dt>
              <dd className="text-charcoal-light leading-relaxed">
                We can arrange{" "}
                <Link href="/services/storage" className={linkClass}>
                  storage
                </Link>{" "}
                so your belongings are safe while dates are sorted out.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-charcoal text-base md:text-lg mb-2">
                Do I need to arrange parking?
              </dt>
              <dd className="text-charcoal-light leading-relaxed">
                Tell us about parking when you get your quote. If a bay
                suspension is needed, you apply to the council, and we will advise
                on how much space the van needs.
              </dd>
            </div>
          </dl>
        </div>
      </FadeIn>
    </div>
  );
}
