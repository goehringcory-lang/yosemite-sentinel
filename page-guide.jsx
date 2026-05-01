/* global React, Placeholder, MotifMountains, NewsletterInline */

const GUIDE_PRICE = "$29";
const GUIDE_BUY_URL = "#";

// Scarcity controls — flip GUIDE_SOLD_THIS_MONTH to 100 to preview the sold-out state.
const GUIDE_SOLD_THIS_MONTH = 53;
const GUIDE_MONTHLY_CAP = 100;
const GUIDE_MONTH_LABEL = "April 2026";
const GUIDE_NEXT_OPEN = "May 1";

function GuidePage({ go }) {
  const remaining = Math.max(0, GUIDE_MONTHLY_CAP - GUIDE_SOLD_THIS_MONTH);
  const isSoldOut = remaining <= 0;
  const soldPct = Math.min(100, (GUIDE_SOLD_THIS_MONTH / GUIDE_MONTHLY_CAP) * 100);

  return (
    <div className="page">
      {/* Hero */}
      <section className="page-head">
        <div className="wrap wrap--narrow">
          <div className="eyebrow eyebrow--moss">The Field Guide · PDF · 2026 Edition</div>
          <h1>Everything I know about visiting Yosemite, in one PDF.</h1>
          <p className="page-head__dek">
            Three full itineraries (one day, three days, five days), GPS coordinates for every parking spot and trailhead I trust, elevation profiles, swap plans for crowded days, and the rules of thumb you only learn after twenty seasons in the park. No padding. No affiliate placements. Just the trip.
          </p>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64, alignItems: "start" }}>

          {/* Left column — body */}
          <div className="prose">
            <Placeholder
              caption="The Field Guide, 2026 Edition"
              tag="PLATE I"
              size="lg"
              style={{ aspectRatio: "16 / 10", marginBottom: 32 }}
              motif={<MotifMountains />}
            />

            <h2>Why a guidebook</h2>

            <p>
              Most of what's on The Talus Field Journal will always be free. The articles, the kit lists, the trail notes — that's how I want this site to work. But the trip-planning side of what I do (the part where someone emails me with their dates, their kids' ages, their hiking comfort, their flight, and asks for a real plan) doesn't fit in an article. It's a book.
            </p>

            <p>
              The Field Guide is that book. It's a single PDF you can read on your phone in the car, print at home if you prefer paper, and pull up at a trailhead when the parking lot decision matters. It's the version of the conversation we'd have if you sat across from me at a picnic table in El Portal and said, "I have five days. Show me what to do."
            </p>

            <h2>What's inside</h2>

            <p>The guide is structured around three trip lengths. You read the one that matches your visit and skim the others for variations.</p>

            <ul>
              <li><strong>The One-Day Plan.</strong> A complete strategy for visitors arriving on a single day, with hour-by-hour timing, two backup variations for crowded conditions, and the three things never to skip.</li>
              <li><strong>The Three-Day Plan.</strong> The most common Yosemite trip. A balanced itinerary across the Valley, Glacier Point, and the giant sequoias, with rest blocks, evening light recommendations, and a flex day that absorbs whatever the park throws at you.</li>
              <li><strong>The Five-Day Plan.</strong> The trip that actually shows you what the park is. Includes a full Tuolumne day, a Hetch Hetchy day, the high-country sunset most visitors never see, and the unhurried mornings that turn a vacation into a memory.</li>
            </ul>

            <p>Inside each itinerary, you get:</p>

            <ul>
              <li><strong>GPS coordinates for every recommended parking spot</strong> — including the small turnouts most visitors never find. Drop the coordinates into your phone, follow the line, park where the locals park.</li>
              <li><strong>GPS coordinates for every trailhead</strong> in the guide, plus the key viewpoints you can reach without hiking.</li>
              <li><strong>Elevation profiles</strong> for every recommended hike. Total gain, peak elevation, and the section where the trail actually gets hard.</li>
              <li><strong>Trip-planning maps</strong> with the day's route, the alternates, and the swap points if the original plan dies.</li>
              <li><strong>Time budgets</strong> for every stop, drive, and meal — the kind of timing that prevents the late-afternoon scramble.</li>
              <li><strong>A printable packing checklist</strong> tuned to the season you're visiting.</li>
              <li><strong>The contingency tree</strong> — what to do if the road is closed, the lot is full, the smoke rolled in, the weather turned.</li>
            </ul>

            <h2>What's NOT inside</h2>

            <p>I think you should know what you're not getting before you buy something.</p>

            <ul>
              <li>This is not an encyclopedia. It will not list every trail in the park or every place to eat. It's a curated trip plan, not a reference.</li>
              <li>It is not a children's activity book or a photography manual. Both could be their own books.</li>
              <li>It does not include rock-climbing routes or technical canyoneering. There are excellent specialist guides for both.</li>
              <li>It does not have affiliate placements baked into the recommendations. The lodging suggestions are places I've stayed and would send my mother to. They're picked, not paid for.</li>
            </ul>

            <h2>Who it's for</h2>

            <p>
              First-time visitors who want a real plan, not a list. Returning visitors who realize the trip they've been doing for years has been the wrong version, and want to fix it. Families coordinating a multi-generational trip and trying to keep everyone happy. Anyone who'd rather spend an evening reading the guide than three weekends researching it.
            </p>

            <p>
              If you've already read every article on this site, taken thorough notes, built your own spreadsheet, called the park three times, and feel like you have a handle on it — you might not need the guide. The guide is for people who want the spreadsheet already built.
            </p>

            <h2 id="why-cap">Why I cap this at 100 a month</h2>

            <p>
              The Field Guide includes parking spots, trailheads, and viewpoints I trust because most visitors haven't found them yet. If a thousand people a month show up at the small turnout that gets you to the quiet beach, it stops being the quiet beach. The recommendations stop being good. The guide stops being worth its price.
            </p>

            <p>
              So I cap it. One hundred copies a month, then the cart closes until the first of the next month. The number isn't a marketing trick. It's the rough volume the places I'm sending you can absorb without becoming the next overcrowded photograph in someone's feed.
            </p>

            <p>
              If you arrive and the month is sold out, come back on the first. The fairer system is to make people wait a few weeks. The alternative is to ruin the locations.
            </p>

            <h2>Format and delivery</h2>

            <ul>
              <li>Single PDF, roughly 120 pages. Hyperlinked table of contents.</li>
              <li>Optimized for both screen reading and home printing (8.5 × 11, no bleed).</li>
              <li>GPS coordinates given in standard decimal degrees and as plain map links you can tap on a phone.</li>
              <li>Delivered immediately after purchase as a download link to the email you provide. Free updates for the 2026 season.</li>
              <li>No DRM. The file is yours. Put it on your phone, your tablet, your laptop, and print it for the car.</li>
            </ul>

            <h2>One small promise</h2>

            <p>
              If you read the guide, take the trip, and feel like the book didn't earn its price, write to me and I'll refund it. I'd rather have a smaller number of trips that worked than a larger number of unhappy purchases. The address is on the contact page.
            </p>

            <p>That's the offer.</p>
          </div>

          {/* Right column — sticky purchase aside */}
          <aside style={{ position: "sticky", top: 100, alignSelf: "start", border: "1px solid var(--ink)", padding: 32, background: "var(--paper-2)" }}>
            <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>The Field Guide</div>
            <div style={{ fontFamily: "var(--display)", fontSize: 56, lineHeight: 1, fontWeight: 500, marginBottom: 8 }}>{GUIDE_PRICE}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", fontWeight: 600, marginBottom: 24 }}>
              PDF · Instant download · 2026 Edition
            </div>

            {/* Scarcity block */}
            <div style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", paddingTop: 18, paddingBottom: 18, marginBottom: 22 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                {isSoldOut ? `${GUIDE_MONTH_LABEL} · Sold out` : `Limited release · ${GUIDE_MONTH_LABEL}`}
              </div>
              <div style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 500, lineHeight: 1.2, marginBottom: 12 }}>
                {isSoldOut
                  ? `0 of ${GUIDE_MONTHLY_CAP} remaining`
                  : `${remaining} of ${GUIDE_MONTHLY_CAP} remaining`}
              </div>
              <div style={{ height: 4, background: "var(--rule)", marginBottom: 12, position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${soldPct}%`, background: "var(--ink)" }} />
              </div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--ink-3)", lineHeight: 1.55 }}>
                {isSoldOut
                  ? <>Reservations open {GUIDE_NEXT_OPEN}. <a href="#why-cap" style={{ color: "var(--ink-2)" }}>Why a cap?</a></>
                  : <>Resets {GUIDE_NEXT_OPEN}. <a href="#why-cap" style={{ color: "var(--ink-2)" }}>Why a cap?</a></>}
              </div>
            </div>

            {isSoldOut ? (
              <button
                className="btn"
                type="button"
                disabled
                style={{ display: "block", width: "100%", textAlign: "center", marginBottom: 14, opacity: 0.45, cursor: "not-allowed", border: 0, font: "inherit" }}
              >
                Sold out — back {GUIDE_NEXT_OPEN}
              </button>
            ) : (
              <a className="btn" href={GUIDE_BUY_URL} style={{ display: "block", textAlign: "center", marginBottom: 14 }}>
                Reserve a copy →
              </a>
            )}

            <p style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, margin: 0 }}>
              One PDF. Three itineraries. GPS coordinates for parking, trailheads, and viewpoints. Elevation profiles. Trip-planning maps. Free updates through the 2026 season. Refund if it doesn't earn its keep.
            </p>

            <div style={{ borderTop: "1px solid var(--rule)", marginTop: 24, paddingTop: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>In the file</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>
                <li>· One-day, three-day, five-day plans</li>
                <li>· GPS coords for every parking spot</li>
                <li>· GPS coords for every trailhead</li>
                <li>· Elevation profiles per hike</li>
                <li>· Trip-planning maps</li>
                <li>· Hour-by-hour time budgets</li>
                <li>· Contingency tree for closures</li>
                <li>· Printable seasonal packing list</li>
              </ul>
            </div>

            <div style={{ borderTop: "1px solid var(--rule)", marginTop: 24, paddingTop: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Questions</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55, margin: 0 }}>
                Email <a href="mailto:Cory@thetalusfieldjournal.com" style={{ color: "var(--ink-2)" }}>Cory@thetalusfieldjournal.com</a> or use <a href="#contact" onClick={(e) => { e.preventDefault(); go("contact"); }} style={{ color: "var(--ink-2)" }}>the contact form</a>.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Newsletter */}
      <div className="wrap wrap--narrow" style={{ paddingBottom: 96 }}>
        <NewsletterInline
          heading="The Sunday Sentinel"
          blurb="A short note on Sundays. Subscribers hear about Field Guide updates and seasonal addenda first."
        />
      </div>
    </div>
  );
}

window.GuidePage = GuidePage;
