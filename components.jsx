/* global React */
const { useState, useEffect, useMemo, useRef } = React;

// ============================================================
// Photo placeholder. Nature-journal treatment.
// ============================================================
function Placeholder({ caption, tag, size, style, motif, image, credit }) {
  return (
    <div
      className={`placeholder ${size === "lg" ? "placeholder--lg" : ""} ${size === "sm" ? "placeholder--sm" : ""} ${image ? "placeholder--photo" : ""}`}
      data-tag={tag || "PLATE"}
      style={style}
    >
      {image && (
        <img
          className="placeholder__img"
          src={image}
          alt={caption || ""}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )}
      {!image && motif && <div className="placeholder__motif">{motif}</div>}
      {caption && <div className="placeholder__caption">{caption}</div>}
      {credit && <div className="placeholder__credit">{credit}</div>}
    </div>
  );
}

// A few simple decorative motifs done in plain SVG (rectangles + circles only,
// per the rule). These are just barely-there silhouette suggestions, not illustrations.
function MotifMountains() {
  return (
    <svg viewBox="0 0 200 100" preserveAspectRatio="none" width="100%" height="100%">
      <path d="M0,90 L40,40 L65,60 L95,20 L130,55 L160,35 L200,70 L200,100 L0,100 Z"
        fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M0,95 L25,75 L55,85 L80,70 L120,80 L150,65 L200,85 L200,100 L0,100 Z"
        fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}
function MotifSun() {
  return (
    <svg viewBox="0 0 200 100" preserveAspectRatio="none" width="100%" height="100%">
      <circle cx="160" cy="38" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="78" x2="200" y2="78" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}
function MotifTrees() {
  return (
    <svg viewBox="0 0 200 100" preserveAspectRatio="none" width="100%" height="100%">
      <line x1="20" y1="20" x2="20" y2="92" stroke="currentColor" strokeWidth="1" />
      <line x1="55" y1="32" x2="55" y2="92" stroke="currentColor" strokeWidth="1" />
      <line x1="88" y1="14" x2="88" y2="92" stroke="currentColor" strokeWidth="1" />
      <line x1="125" y1="28" x2="125" y2="92" stroke="currentColor" strokeWidth="1" />
      <line x1="162" y1="20" x2="162" y2="92" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

// ============================================================
// Masthead
// ============================================================
function Header({ current, go }) {
  // Primary text links. Content people read every visit.
  const primaryNav = [
    ["articles", "Articles"],
    ["kit", "Kit"],
  ];
  // Secondary items, lower-frequency utility. Tucked behind a dropdown.
  // Articles + Kit are duplicated here (and CSS-hidden at desktop) so the dropdown
  // is a complete fallback nav at narrow widths, where the primary text links collapse.
  const moreNav = [
    ["articles", "Articles", "is-mobile-only"],
    ["kit", "Kit", "is-mobile-only"],
    ["places", "Places & People"],
    ["about", "About"],
    ["newsletter", "Newsletter"],
    ["contact", "Contact"],
  ];
  const moreContains = moreNav.some(([k]) => k === current);

  const [moreOpen, setMoreOpen] = React.useState(false);
  const moreRef = React.useRef(null);
  React.useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setMoreOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [moreOpen]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  return (
    <header className="masthead">
      <div className="masthead__top">
        <div>
          <span>Vol. III · No. 18</span>
          <span>{today}</span>
        </div>
        <div className="masthead__weather">
          <span className="masthead__weather-label">Conditions</span>
          <a href="https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936" target="_blank" rel="noopener noreferrer">Yosemite Valley</a>
          <span className="masthead__weather-sep">·</span>
          <a href="https://forecast.weather.gov/MapClick.php?lat=37.8731&lon=-119.3503" target="_blank" rel="noopener noreferrer">Tuolumne Meadows</a>
          <span className="masthead__weather-sep">·</span>
          <a href="https://forecast.weather.gov/MapClick.php?lat=37.5341&lon=-119.6315" target="_blank" rel="noopener noreferrer">Wawona</a>
          <span className="masthead__paper">
            <span className="masthead__paper-label">Current issue</span>
            <a href="https://www.nps.gov/yose/planyourvisit/guide.htm" target="_blank" rel="noopener noreferrer">Yosemite Guide ↗</a>
          </span>
        </div>
      </div>
      <div className="masthead__main">
        <a
          className="brand-block"
          href="#home"
          onClick={(e) => { e.preventDefault(); go("home"); }}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <span className="brand">The Talus Field</span>
          <span className="brand__sub">A field journal of Yosemite</span>
        </a>
        <nav className="nav">
          {primaryNav.map(([key, label]) => (
            <a
              key={key}
              href={`#${key}`}
              className={current === key ? "is-active" : ""}
              onClick={(e) => { e.preventDefault(); go(key); }}
            >{label}</a>
          ))}

          <div className="nav__more" ref={moreRef}>
            <button
              type="button"
              className={`nav__more-trigger ${moreContains ? "is-active" : ""}`}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen(o => !o)}
            >
              More <span className="nav__more-caret" aria-hidden="true">▾</span>
            </button>
            {moreOpen && (
              <div className="nav__menu" role="menu">
                {moreNav.map(([key, label, extra]) => (
                  <a
                    key={key}
                    role="menuitem"
                    href={`#${key}`}
                    className={`${current === key ? "is-active" : ""} ${extra || ""}`.trim()}
                    onClick={(e) => { e.preventDefault(); setMoreOpen(false); go(key); }}
                  >{label}</a>
                ))}
              </div>
            )}
          </div>

          <a
            href="#guide"
            className={`nav__primary ${current === "guide" ? "is-active" : ""}`}
            onClick={(e) => { e.preventDefault(); go("guide"); }}
          >The Field Guide →</a>
        </nav>
      </div>
    </header>
  );
}

// ============================================================
// Site footer
// ============================================================
function Footer({ go }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          <div className="site-footer__about">
            <div className="site-footer__masthead">The Talus Field</div>
            <div className="site-footer__sub">A field journal of Yosemite</div>
            <p>Notes on a single park, kept slowly. Updated when something is worth saying.</p>
          </div>
          <div>
            <h4>Sections</h4>
            <ul>
              {window.CATEGORIES.map(c => (
                <li key={c.slug}>
                  <a href={`#cat:${c.slug}`} onClick={(e) => { e.preventDefault(); go(`cat:${c.slug}`); }}>{c.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Site</h4>
            <ul>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); go("about"); }}>About</a></li>
              <li><a href="#articles" onClick={(e) => { e.preventDefault(); go("articles"); }}>All articles</a></li>
              <li><a href="#places" onClick={(e) => { e.preventDefault(); go("places"); }}>Places &amp; People</a></li>
              <li><a href="#newsletter" onClick={(e) => { e.preventDefault(); go("newsletter"); }}>Newsletter</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); go("contact"); }}>Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); go("privacy"); }}>Privacy</a></li>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); go("terms"); }}>Terms</a></li>
              <li><a href="#affiliate" onClick={(e) => { e.preventDefault(); go("affiliate"); }}>Affiliate disclosure</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); go("contact"); }}>Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__disclosure">
          Some links on this site are affiliate links. If you book or buy through one, The Talus Field may earn a small commission at no extra cost to you. <a href="#affiliate" onClick={(e) => { e.preventDefault(); go("affiliate"); }}>Full disclosure here.</a>
        </div>
        <div className="site-footer__legal">
          <div>© 2026 The Talus Field. Independent. Not affiliated with the National Park Service.</div>
          <div>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); go("privacy"); }}>Privacy</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); go("terms"); }}>Terms</a>
            <a href="#affiliate" onClick={(e) => { e.preventDefault(); go("affiliate"); }}>Affiliate</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// Article card
// ============================================================
function ArticleCard({ article, go, size }) {
  const cat = window.findCategory(article.cat);
  return (
    <a
      className="card"
      href={`#a:${article.slug}`}
      onClick={(e) => { e.preventDefault(); go(`a:${article.slug}`); }}
    >
      <Placeholder
        caption={article.placeholder}
        image={article.image}
        tag={cat.label.split(" ")[0]}
        size={size === "sm" ? "sm" : null}
        style={{ aspectRatio: size === "wide" ? "16/9" : "4/3" }}
        motif={
          article.cat === "trails" ? <MotifMountains /> :
          article.cat === "wildlife" ? <MotifTrees /> :
          article.cat === "seasonal" ? <MotifSun /> : null
        }
      />
      <div style={{ marginTop: 14 }}>
        <div className="card__cat">{cat.label}</div>
        <div className="card__title">{article.title}</div>
        {size !== "sm" && <div className="card__dek">{article.dek}</div>}
        <div className="card__meta">
          <span>{article.date}</span>
          <span>{article.read}</span>
        </div>
      </div>
    </a>
  );
}

// ============================================================
// Inline newsletter box
// ============================================================
function NewsletterInline({ heading, blurb }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="nlbox">
      <h3>{heading || "Sunday Field Notes"}</h3>
      <p>{blurb || "A short note on Sundays, when there is something to say."}</p>
      {done ? (
        <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--moss)" }}>
          Thanks. Check your inbox to confirm.
        </div>
      ) : (
        <form
          className="nlbox__form"
          onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
        >
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe →</button>
        </form>
      )}
    </div>
  );
}

// Expose
Object.assign(window, {
  Placeholder, MotifMountains, MotifSun, MotifTrees,
  Header, Footer, ArticleCard, NewsletterInline,
});
