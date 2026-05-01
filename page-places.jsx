/* global React, NewsletterInline */

function PlacesPage({ go }) {
  const recs = window.KIT.recommendations;

  return (
    <div className="page">
      {/* Page head */}
      <section className="page-head">
        <div className="wrap wrap--narrow">
          <div className="eyebrow eyebrow--moss">Places & People</div>
          <h1>Where to stay and who to hire.</h1>
          <p className="page-head__dek">
            A curated directory of lodging, outfitters, and guiding services in and around Yosemite. Some listings are personal recommendations from twenty seasons in the park. Others are sponsored placements from operators I've vetted. Both are clearly labeled.
          </p>
        </div>
      </section>

      {/* Lodging */}
      <section className="wrap" style={{ paddingTop: 56 }}>
        <div className="section-head">
          <h2>Lodging</h2>
          <div className="mono" style={{ color: "var(--ink-3)" }}>{recs.lodging.length} listings</div>
        </div>
        <div className="kit__rec-grid">
          <div style={{ gridColumn: "1 / -1" }}>
            <ul className="kit__rec">
              {recs.lodging.map((r, i) => (
                <li key={i}>
                  <div className="kit__rec-name">{r.name}</div>
                  <div className="kit__rec-area">{r.area}</div>
                  <div className="kit__rec-note">{r.note}</div>
                  <a className="kit__rec-link" href={r.aff} target="_blank" rel="noopener nofollow sponsored noreferrer">View site ↗</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Guides & instruction */}
      <section className="wrap" style={{ paddingTop: 64 }}>
        <div className="section-head">
          <h2>Guides &amp; instruction</h2>
          <div className="mono" style={{ color: "var(--ink-3)" }}>{recs.guides.length} listings</div>
        </div>
        <div className="kit__rec-grid">
          <div style={{ gridColumn: "1 / -1" }}>
            <ul className="kit__rec">
              {recs.guides.map((r, i) => (
                <li key={i}>
                  <div className="kit__rec-name">{r.name}</div>
                  <div className="kit__rec-area">{r.area}</div>
                  <div className="kit__rec-note">{r.note}</div>
                  <a className="kit__rec-link" href={r.aff} target="_blank" rel="noopener nofollow sponsored noreferrer">View site ↗</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Quiet pointer to the operator advertise page */}
      <section className="wrap" style={{ paddingTop: 80 }}>
        <div className="places-strip">
          <div className="places-strip__copy">
            <span className="places-strip__eyebrow">For operators ·</span>
            <span>Run a Yosemite-adjacent business? Get listed in the directory.</span>
          </div>
          <a
            className="places-strip__cta"
            href="#advertise"
            onClick={(e) => { e.preventDefault(); go("advertise"); }}
          >Advertise with us →</a>
        </div>
      </section>

      {/* Newsletter */}
      <div className="wrap wrap--narrow" style={{ paddingTop: 80, paddingBottom: 96 }}>
        <NewsletterInline
          heading="Sunday Field Notes"
          blurb="One letter a week. Subscribers see new directory additions and seasonal updates first."
        />
      </div>
    </div>
  );
}

window.PlacesPage = PlacesPage;
