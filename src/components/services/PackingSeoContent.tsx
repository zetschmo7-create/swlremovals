import Link from "next/link";

const linkClass =
  "font-medium text-green-800 hover:text-green-900 underline-offset-2 hover:underline";

export function PackingSeoContent() {
  return (
    <div className="space-y-12 max-w-3xl">
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          Packing services for home and office moves
        </h2>
        <p className="text-lg text-charcoal-light leading-relaxed">
          Packing is the part of a move that takes the longest. We offer full
          packing, where our team packs everything, and partial packing, where we
          pack only the fragile or awkward items such as kitchenware, pictures
          and mirrors. Wardrobe boxes are available for hanging clothes.
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          What is included
        </h2>
        <p className="text-lg text-charcoal-light leading-relaxed">
          Quality boxes and wrapping materials, careful labelling by room, and
          unpacking help on request. Tell us which rooms you want packed when you
          request your quote.
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          Full or partial packing?
        </h2>
        <p className="text-lg text-charcoal-light leading-relaxed">
          Full packing suits tight timelines, large homes or busy families.
          Partial packing is a good fit if you want to pack everyday items
          yourself and leave the fragile ones to us. Combine packing with a{" "}
          <Link href="/services/house-removals" className={linkClass}>
            house move
          </Link>{" "}
          or{" "}
          <Link href="/services/office-removals" className={linkClass}>
            office move
          </Link>
          .
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          Packing tips if you pack yourself
        </h2>
        <p className="text-lg text-charcoal-light leading-relaxed">
          Use small boxes for heavy items and large boxes for light ones, label
          every box with its room, and pack a clearly marked essentials box for
          the first night.
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          Packing FAQ
        </h2>
        <ul className="space-y-4 text-charcoal-light leading-relaxed">
          <li>
            <em className="not-italic font-medium text-charcoal">
              Can you pack just one room?
            </em>{" "}
            Yes. Tell us which rooms and we will include them in your quote.
          </li>
          <li>
            <em className="not-italic font-medium text-charcoal">
              Can I use your boxes without a packing service?
            </em>{" "}
            Ask when you request your quote.
          </li>
          <li>
            <em className="not-italic font-medium text-charcoal">
              How long does packing take?
            </em>{" "}
            It depends on the size of the property. We estimate this from your
            video walkthrough.
          </li>
        </ul>
      </div>
    </div>
  );
}
