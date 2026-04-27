/* global React, Placeholder, NewsletterInline, ArticleCard, MotifMountains */

function ArticlePage({ slug, go }) {
  const article = window.findArticle(slug);
  if (!article) return <div className="wrap" style={{ padding: 80 }}>Not found.</div>;
  const cat = window.findCategory(article.cat);
  const related = window.ARTICLES.filter(a => a.slug !== slug && a.cat === article.cat).slice(0, 3);
  const Body = (window.ARTICLE_BODIES || {})[slug];

  // Sticky "Get the Field Guide" bar appears once the reader has scrolled past the dropcap.
  const [showGuideBar, setShowGuideBar] = React.useState(false);
  React.useEffect(() => {
    setShowGuideBar(false);
    const el = document.querySelector(".prose .dropcap");
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        // Show the bar once the dropcap has scrolled out of view above the viewport.
        const past = entry.boundingClientRect.bottom < 0;
        setShowGuideBar(past);
      },
      { threshold: 0, rootMargin: "0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [slug]);

  return (
    <div className="page">
      {/* Sticky Field Guide promo bar */}
      <div className={`guide-bar ${showGuideBar ? "is-visible" : ""}`} role="region" aria-label="Field Guide promotion">
        <div className="wrap guide-bar__inner">
          <div className="guide-bar__copy">
            <span className="guide-bar__eyebrow">The Field Guide ·</span>
            <span className="guide-bar__pitch">Three trip plans, GPS for every parking spot and trailhead, elevation profiles. The version of this article without the gaps.</span>
          </div>
          <a
            className="guide-bar__cta"
            href="#guide"
            onClick={(e) => { e.preventDefault(); go("guide"); }}
          >Get the guide →</a>
        </div>
      </div>
      <article>
        {/* Article hero */}
        <header className="wrap wrap--narrow" style={{ paddingTop: 64, paddingBottom: 32 }}>
          <div className="eyebrow eyebrow--moss" style={{ marginBottom: 18 }}>
            <a href={`#cat:${cat.slug}`} onClick={(e) => { e.preventDefault(); go(`cat:${cat.slug}`); }}
              style={{ color: "var(--moss)", textDecoration: "none" }}>
              {cat.label}
            </a>
          </div>
          <h1 style={{ marginBottom: 24 }}>{article.title}</h1>
          <p style={{ fontSize: 22, color: "var(--ink-2)", lineHeight: 1.45, fontFamily: "var(--serif)", marginBottom: 32 }}>
            {article.dek}
          </p>
          <div style={{ display: "flex", gap: 18, alignItems: "center", fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", padding: "14px 0" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--paper-2)", border: "1px solid var(--rule)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--serif)", fontWeight: 600, color: "var(--ink-2)" }}>PW</div>
            <div>
              <div style={{ color: "var(--ink)", fontWeight: 500 }}>By {window.SITE.authorName}</div>
              <div>{window.SITE.authorBio}</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div>{article.date}</div>
              <div>{article.read} read</div>
            </div>
          </div>
        </header>

        <div className="wrap wrap--narrow" style={{ paddingBottom: 32 }}>
          <Placeholder
            caption={article.placeholder}
            image={article.image}
            credit={article.credit}
            tag="PLATE I"
            size="lg"
            style={{ aspectRatio: "16 / 10" }}
            motif={<MotifMountains />}
          />
        </div>

        {/* Body */}
        <div className="wrap wrap--read">
          <div className="prose">
            {article.cat === "planning" && (
              <div className="statblock">
                <div className="statblock__item"><span className="label">Best for</span><span className="val">First visits</span></div>
                <div className="statblock__item"><span className="label">Reading time</span><span className="val">{article.read}</span></div>
                <div className="statblock__item"><span className="label">Updated</span><span className="val">{article.date}</span></div>
                <div className="statblock__item"><span className="label">Section</span><span className="val">{cat.label}</span></div>
              </div>
            )}

            {Body ? <Body /> : (
              <p style={{ color: "var(--ink-3)", fontStyle: "italic" }}>This article is coming soon.</p>
            )}

            <aside className="guide-cta">
              <div className="guide-cta__eyebrow">Plan the actual trip</div>
              <h3 className="guide-cta__title">Want this, but for the whole trip?</h3>
              <p className="guide-cta__body">
                The Field Guide is one PDF that gives you three full itineraries (one day, three days, five days), GPS coordinates for every parking spot and trailhead I trust, elevation profiles for the hikes, and the contingency tree for when the plan doesn't survive contact with the park.
              </p>
              <a
                className="guide-cta__btn"
                href="#guide"
                onClick={(e) => { e.preventDefault(); go("guide"); }}
              >Read about the Field Guide →</a>
            </aside>
          </div>

          <NewsletterInline
            heading="The Sunday Sentinel"
            blurb="One letter a week. If you found this useful, you'll probably like the rest."
          />
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="wrap" style={{ paddingTop: 48, paddingBottom: 32 }}>
          <div className="section-head">
            <h2>More from {cat.label}</h2>
            <a href={`#cat:${cat.slug}`} onClick={(e) => { e.preventDefault(); go(`cat:${cat.slug}`); }}>All in {cat.label} →</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36 }}>
            {related.map(a => <ArticleCard key={a.slug} article={a} go={go} />)}
          </div>
        </section>
      )}
    </div>
  );
}

window.ArticlePage = ArticlePage;
