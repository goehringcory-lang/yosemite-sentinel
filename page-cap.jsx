/* global React, NewsletterInline */

function CapPage({ go }) {
  return (
    <div className="page">
      {/* Page head */}
      <section className="page-head">
        <div className="wrap wrap--narrow">
          <div className="eyebrow eyebrow--moss">The Field Guide · Policy</div>
          <h1>Why the Field Guide is capped at 100 a month.</h1>
          <p className="page-head__dek">
            I close the cart at one hundred copies, then again the next month. The cap is real, not a marketing trick. Here is the reasoning.
          </p>
        </div>
      </section>

      <div className="wrap wrap--read" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div className="prose" style={{ fontSize: 18 }}>
          <h2>The short version</h2>

          <p>
            The Field Guide names parking turnouts, side paths, and viewpoints that haven't been crowded yet. They are uncrowded because most visitors don't know about them. If a thousand people a month walk the half-mile to the quiet beach below the falls, it stops being the quiet beach below the falls. The recommendation stops being good. The guide stops being worth its price.
          </p>

          <p>
            So I limit how many people I send. One hundred copies a month, then the cart closes until the first of the next month.
          </p>

          <h2>The carrying capacity of a small place</h2>

          <p>
            A few of the locations in the guide can host roughly thirty people a day before they tip from quiet to the kind of crowded that ruins the visit. Some can host far fewer. An off-trail meadow that holds five at a time is a different beast than a viewpoint that comfortably holds two hundred.
          </p>

          <p>
            A hundred buyers a month, spread across an arrival window of three to four weeks, with most readers visiting only a subset of the spots on any given day, puts the marginal foot traffic at any one location in the single digits per day. That is a number the places can absorb without becoming the next over-photographed location in someone's feed.
          </p>

          <p>
            If I sold five hundred copies a month, the math breaks. The places stop being the places I was sending you to.
          </p>

          <h2>The reset</h2>

          <p>
            Sales reset on the first of every month at midnight Pacific. If the cap is hit on the seventeenth, the next opportunity is the first. There is no waitlist, no skip line, no "subscribers get early access." First come, first served, then everyone else waits. It is an inconvenient system. I know.
          </p>

          <h2>On the lost revenue</h2>

          <p>
            I am aware this caps my income from the guide. That is the trade. I would rather sell fewer copies of something that still works than many copies of something that doesn't. The cap is the difference between selling a recommendation and selling out a recommendation.
          </p>

          <p>
            The math also keeps the guide honest. When I cannot scale by raising volume, I cannot get lazy about quality. Each cohort matters. If a route falls apart in the field, the next cohort hears about it before they go. The cap is partly a forcing function on me.
          </p>

          <h2>If you got shut out</h2>

          <p>
            Come back on the first. If you are flexible, set a calendar reminder for the morning of the first; the early hours of a new month are the most reliable time to buy.
          </p>

          <p>
            If your trip is on a hard timeline and missing this month puts the trip at risk, <a href="#contact" onClick={(e) => { e.preventDefault(); go("contact"); }}>write to me directly</a>. There is a small reserve for genuine emergencies of timing, drawn from the next month's allotment. I do not advertise it because the people who need it are not the people who would game it.
          </p>

          <h2>A few edge cases</h2>

          <ul>
            <li><strong>Group purchases.</strong> One family buying for the whole party counts once. One purchase, one access, share within the group.</li>
            <li><strong>Refunds.</strong> Refunds inside sixty days return the slot to the same month's pool. If you bought it, read it, and it didn't earn its price, you get your money back.</li>
            <li><strong>Lifetime access.</strong> Does not exist. The guide is current through the 2026 season. The 2027 edition will price separately.</li>
            <li><strong>Resold copies.</strong> The guide is licensed to one buyer. Reselling or sharing the access link is an honor-system rule rather than a technical lock, but please don't. Doing so undermines the cap, which undermines the places.</li>
          </ul>

          <h2>The deal</h2>

          <p>
            You buy a guide, you get a working trip plan, you visit the places I trust, and the places remain trustable for the people who buy in May, August, and the following spring. I would rather build a small thing that lasts five seasons than a big thing that lasts one.
          </p>

          <p>That is why the cap.</p>

          <p style={{ marginTop: 40 }}>
            <a href="#guide" onClick={(e) => { e.preventDefault(); go("guide"); }}>← Back to the Field Guide</a>
          </p>
        </div>
      </div>

      {/* Newsletter. First place new openings are announced. */}
      <div className="wrap wrap--narrow" style={{ paddingTop: 24, paddingBottom: 96 }}>
        <NewsletterInline
          heading="Sunday Field Notes"
          blurb="Subscribers hear when the next month opens, what's been added to the guide, and any reroutes triggered by closures."
        />
      </div>
    </div>
  );
}

window.CapPage = CapPage;
