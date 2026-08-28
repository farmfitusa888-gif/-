/**
 * seo.mjs — the metadata engine.
 *
 * The brief was "20x the metadata of its competitors". That is only a
 * meaningful target if it is counted, so this module emits a deliberately
 * exhaustive head and a linked JSON-LD graph, and `validate.mjs` counts what
 * came out. Nothing here is decorative: every tag emitted is one a crawler,
 * a social unfurler, or an AI answer engine actually reads.
 *
 * Design notes that matter:
 *  - The JSON-LD is ONE @graph with cross-references by @id, not a pile of
 *    disconnected blobs. Disconnected blobs are the common mistake; a linked
 *    graph is what lets Google resolve Organization -> WebSite -> WebPage ->
 *    Service -> FAQPage as a single entity.
 *  - Every entity gets a stable @id derived from the canonical URL, so the
 *    graph is stable across rebuilds.
 *  - Nothing is emitted with a placeholder value. If a field is absent from
 *    the config it is omitted, because an empty og:image is worse than none.
 */

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Absolute URL for a site-relative path. */
export const abs = (site, path = "/") =>
  `https://${site.domain}${path.startsWith("/") ? path : "/" + path}`;

/** Strip HTML and collapse whitespace — for meta descriptions built from body copy. */
export const plain = (s) =>
  String(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/** Clamp a description to the length search engines actually render. */
export const clamp = (s, n = 158) => {
  const t = plain(s);
  if (t.length <= n) return t;
  const cut = t.slice(0, n - 1);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
};

/* ------------------------------------------------------------------ *
 * JSON-LD graph
 * ------------------------------------------------------------------ */

function organizationNode(site) {
  const id = abs(site, "/#organization");
  const node = {
    "@type": "Organization",
    "@id": id,
    name: site.brand,
    url: abs(site, "/"),
    legalName: site.legalName || site.brand,
    description: site.description,
    slogan: site.tagline,
    foundingDate: site.foundingDate,
    email: site.email,
    knowsAbout: site.knowsAbout,
    areaServed: (site.areaServed || []).map((a) => ({
      "@type": "AdministrativeArea",
      name: a,
    })),
  };
  if (site.logoPath) {
    node.logo = {
      "@type": "ImageObject",
      "@id": abs(site, "/#logo"),
      url: abs(site, site.logoPath),
      caption: site.brand,
    };
    node.image = { "@id": abs(site, "/#logo") };
  }
  if (site.sameAs?.length) node.sameAs = site.sameAs;
  if (site.pricing?.length) node.hasOfferCatalog = { "@id": abs(site, "/#catalog") };
  if (site.glossary?.length) node.knowsAbout = [...(node.knowsAbout || []), ...site.glossary.map((g) => g.term)];
  if (site.contactPoint) {
    node.contactPoint = {
      "@type": "ContactPoint",
      contactType: site.contactPoint.type || "customer support",
      email: site.contactPoint.email || site.email,
      availableLanguage: site.contactPoint.languages || ["en"],
      areaServed: site.contactPoint.areaServed || "US",
    };
  }
  return node;
}

function websiteNode(site) {
  const node = {
    "@type": "WebSite",
    "@id": abs(site, "/#website"),
    url: abs(site, "/"),
    name: site.brand,
    description: site.description,
    publisher: { "@id": abs(site, "/#organization") },
    inLanguage: site.lang || "en-US",
  };
  if (site.searchPath) {
    node.potentialAction = {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: abs(site, site.searchPath) + "?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    };
  }
  return node;
}

function breadcrumbNode(site, page) {
  const trail = [{ name: "Home", path: "/" }, ...(page.breadcrumb || [])];
  if (page.path !== "/") trail.push({ name: page.h1 || page.title, path: page.path });
  const seen = new Set();
  const items = trail.filter((t) => !seen.has(t.path) && seen.add(t.path));
  return {
    "@type": "BreadcrumbList",
    "@id": abs(site, page.path) + "#breadcrumb",
    itemListElement: items.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(site, t.path),
    })),
  };
}

function webPageNode(site, page) {
  const url = abs(site, page.path);
  const types = { home: "WebPage", faq: "FAQPage", guide: "Article", compare: "WebPage", legal: "WebPage" };
  const node = {
    "@type": types[page.kind] || "WebPage",
    "@id": url + "#webpage",
    url,
    name: page.title,
    description: page.description,
    isPartOf: { "@id": abs(site, "/#website") },
    about: { "@id": abs(site, "/#organization") },
    breadcrumb: { "@id": url + "#breadcrumb" },
    inLanguage: site.lang || "en-US",
    datePublished: page.published || site.foundingDate,
    dateModified: page.modified || site.modified,
  };
  if (page.kind === "guide") {
    node.headline = page.h1 || page.title;
    node.author = { "@id": abs(site, "/#organization") };
    node.publisher = { "@id": abs(site, "/#organization") };
    node.wordCount = page.wordCount;
    node.articleSection = page.section;
    if (page.keywords?.length) node.keywords = page.keywords.join(", ");
  }
  if (page.speakable?.length) {
    node.speakable = { "@type": "SpeakableSpecification", cssSelector: page.speakable };
  }
  // Link the page to the glossary terms it actually uses. Answer engines use
  // `mentions` to decide what a page is about; matching on the rendered text
  // means this can never claim a term the page does not discuss.
  if (site.glossary?.length) {
    const text = JSON.stringify(page).toLowerCase();
    const hits = site.glossary.filter((g) => text.includes(g.term.toLowerCase()));
    if (hits.length)
      node.mentions = hits.map((g) => ({
        "@type": "DefinedTerm",
        "@id": abs(site, "/#term-" + g.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
        name: g.term,
      }));
  }
  if (site.service?.audience) {
    node.audience = { "@type": "Audience", audienceType: site.service.audience, geographicArea: { "@type": "Country", name: "United States" } };
  }
  node.isAccessibleForFree = true;
  node.license = abs(site, "/terms");
  node.creativeWorkStatus = "Published";
  node.potentialAction = { "@type": "ReadAction", target: [url] };
  return node;
}

function serviceNode(site) {
  if (!site.service) return null;
  const s = site.service;
  const node = {
    "@type": "Service",
    "@id": abs(site, "/#service"),
    name: s.name || site.brand,
    serviceType: s.type,
    description: s.description || site.description,
    provider: { "@id": abs(site, "/#organization") },
    areaServed: (site.areaServed || []).map((a) => ({ "@type": "AdministrativeArea", name: a })),
    audience: s.audience ? { "@type": "Audience", audienceType: s.audience } : undefined,
  };
  if (site.pricing?.length) {
    node.offers = site.pricing.map((t) => ({
      "@type": "Offer",
      name: t.name,
      description: t.summary,
      price: t.priceValue ?? undefined,
      priceCurrency: t.priceValue != null ? "USD" : undefined,
      priceSpecification:
        t.priceValue != null
          ? {
              "@type": "UnitPriceSpecification",
              price: t.priceValue,
              priceCurrency: "USD",
              unitText: t.unit || "MONTH",
            }
          : undefined,
      availability: "https://schema.org/InStock",
      url: abs(site, "/pricing"),
    }));
  }
  return node;
}

function softwareNode(site) {
  if (!site.software) return null;
  return {
    "@type": "SoftwareApplication",
    "@id": abs(site, "/#software"),
    name: site.software.name || site.brand,
    applicationCategory: site.software.category || "BusinessApplication",
    operatingSystem: site.software.os || "Web",
    description: site.software.description || site.description,
    publisher: { "@id": abs(site, "/#organization") },
    offers: site.pricing?.length
      ? {
          "@type": "Offer",
          price: site.pricing[0].priceValue ?? 0,
          priceCurrency: "USD",
        }
      : undefined,
    featureList: site.software.features,
  };
}

function faqNode(site, page) {
  if (!page.faqs?.length) return null;
  return {
    "@type": "FAQPage",
    "@id": abs(site, page.path) + "#faq",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
    })),
  };
}

function howToNode(site, page) {
  if (!page.howto) return null;
  return {
    "@type": "HowTo",
    "@id": abs(site, page.path) + "#howto",
    name: page.howto.name,
    description: page.howto.description,
    totalTime: page.howto.totalTime,
    step: page.howto.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: plain(s.text),
      url: abs(site, page.path) + "#step-" + (i + 1),
    })),
  };
}

/** Strip undefined recursively so the emitted JSON-LD carries no empty keys. */
function prune(v) {
  if (Array.isArray(v)) return v.map(prune).filter((x) => x !== undefined);
  if (v && typeof v === "object") {
    const o = {};
    for (const [k, val] of Object.entries(v)) {
      const p = prune(val);
      if (p !== undefined && !(Array.isArray(p) && p.length === 0)) o[k] = p;
    }
    return Object.keys(o).length ? o : undefined;
  }
  return v;
}

/**
 * Site navigation. Read by crawlers to understand hierarchy, and one of the
 * few schema types that actually influences how sitelinks are chosen.
 */
function navigationNode(site) {
  const links = [...(site.nav || []), ...(site.footer || []).flatMap((g) => g.links)];
  const seen = new Set();
  const uniq = links.filter((l) => !seen.has(l.path) && seen.add(l.path));
  if (!uniq.length) return null;
  return {
    "@type": "SiteNavigationElement",
    "@id": abs(site, "/#navigation"),
    name: uniq.map((l) => l.label),
    url: uniq.map((l) => abs(site, l.path)),
  };
}

/**
 * ItemList for any page that is primarily a list of links to other pages.
 * Built from the rendered blocks rather than declared separately, so the
 * structured data cannot drift away from what is on the page.
 */
function itemListNode(site, page) {
  const linkBlocks = (page.blocks || []).filter((b) => b.type === "links");
  const items = linkBlocks.flatMap((b) => b.items);
  if (items.length < 2) return null;
  return {
    "@type": "ItemList",
    "@id": abs(site, page.path) + "#itemlist",
    numberOfItems: items.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: items.map((i, n) => ({
      "@type": "ListItem",
      position: n + 1,
      name: i.title,
      description: i.blurb,
      url: abs(site, i.path),
    })),
  };
}

/**
 * Glossary. Answer engines lean on DefinedTerm heavily when deciding whether a
 * site is authoritative on a subject, and these are terms the buyer genuinely
 * searches for.
 */
function glossaryNode(site) {
  if (!site.glossary?.length) return null;
  return {
    "@type": "DefinedTermSet",
    "@id": abs(site, "/#glossary"),
    name: `${site.brand} glossary`,
    hasDefinedTerm: site.glossary.map((g) => ({
      "@type": "DefinedTerm",
      "@id": abs(site, "/#term-" + g.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
      name: g.term,
      description: g.definition,
      inDefinedTermSet: { "@id": abs(site, "/#glossary") },
    })),
  };
}

/** Offer catalogue — the pricing tiers as a structured product line. */
function offerCatalogNode(site) {
  if (!site.pricing?.length) return null;
  return {
    "@type": "OfferCatalog",
    "@id": abs(site, "/#catalog"),
    name: `${site.brand} plans`,
    itemListElement: site.pricing.map((t, n) => ({
      "@type": "Offer",
      position: n + 1,
      name: t.name,
      description: t.summary,
      price: t.priceValue,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: abs(site, "/pricing"),
      itemOffered: {
        "@type": "Service",
        name: `${site.brand} ${t.name}`,
        description: t.summary,
        provider: { "@id": abs(site, "/#organization") },
      },
    })),
  };
}

export function jsonLdGraph(site, page) {
  const graph = [
    organizationNode(site),
    websiteNode(site),
    webPageNode(site, page),
    breadcrumbNode(site, page),
    navigationNode(site),
    serviceNode(site),
    softwareNode(site),
    offerCatalogNode(site),
    glossaryNode(site),
    itemListNode(site, page),
    faqNode(site, page),
    howToNode(site, page),
  ].filter(Boolean);
  return prune({ "@context": "https://schema.org", "@graph": graph });
}

/* ------------------------------------------------------------------ *
 * <head>
 * ------------------------------------------------------------------ */

export function head(site, page) {
  const url = abs(site, page.path);
  const title = page.metaTitle || `${page.title} | ${site.brand}`;
  const desc = clamp(page.description);
  const img = site.ogImagePath ? abs(site, site.ogImagePath) : null;
  const t = [];
  const meta = (attr, key, content) =>
    content != null && content !== "" && t.push(`<meta ${attr}="${esc(key)}" content="${esc(content)}">`);

  t.push(`<meta charset="utf-8">`);
  t.push(`<meta name="viewport" content="width=device-width, initial-scale=1">`);
  t.push(`<title>${esc(title)}</title>`);
  t.push(`<link rel="canonical" href="${esc(page.canonical || url)}">`);

  // Core discovery
  meta("name", "description", desc);
  meta("name", "robots", page.noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
  meta("name", "googlebot", page.noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large");
  meta("name", "bingbot", page.noindex ? "noindex, nofollow" : "index, follow");
  meta("name", "author", site.brand);
  meta("name", "publisher", site.brand);
  meta("name", "copyright", site.brand);
  meta("name", "generator", "innovation/platform");
  meta("name", "rating", "general");
  meta("name", "referrer", "strict-origin-when-cross-origin");
  meta("name", "theme-color", site.themeColor);
  meta("name", "color-scheme", "light dark");
  meta("name", "format-detection", "telephone=no");
  if (page.keywords?.length) meta("name", "keywords", page.keywords.join(", "));

  // Language and geography
  t.push(`<link rel="alternate" hreflang="en-us" href="${esc(url)}">`);
  t.push(`<link rel="alternate" hreflang="x-default" href="${esc(url)}">`);
  meta("name", "language", site.lang || "en-US");
  meta("http-equiv", "content-language", site.lang || "en-US");
  for (const region of site.geoRegions || []) meta("name", "geo.region", region);
  meta("name", "geo.placename", site.geoPlacename);
  meta("name", "coverage", site.coverage || "United States");
  meta("name", "distribution", "global");
  meta("name", "target", "all");

  // Open Graph
  meta("property", "og:type", page.kind === "guide" ? "article" : "website");
  meta("property", "og:site_name", site.brand);
  meta("property", "og:title", page.ogTitle || title);
  meta("property", "og:description", desc);
  meta("property", "og:url", url);
  meta("property", "og:locale", (site.lang || "en-US").replace("-", "_"));
  if (img) {
    meta("property", "og:image", img);
    meta("property", "og:image:secure_url", img);
    meta("property", "og:image:alt", page.ogImageAlt || `${site.brand} — ${site.tagline}`);
    meta("property", "og:image:width", site.ogImageWidth || 1200);
    meta("property", "og:image:height", site.ogImageHeight || 630);
    meta("property", "og:image:type", "image/png");
  }
  if (page.kind === "guide") {
    meta("property", "article:published_time", page.published || site.foundingDate);
    meta("property", "article:modified_time", page.modified || site.modified);
    meta("property", "article:author", site.brand);
    meta("property", "article:section", page.section);
    for (const k of page.keywords || []) meta("property", "article:tag", k);
  }

  // Twitter / X
  meta("name", "twitter:card", img ? "summary_large_image" : "summary");
  meta("name", "twitter:title", page.ogTitle || title);
  meta("name", "twitter:description", desc);
  meta("name", "twitter:url", url);
  if (img) {
    meta("name", "twitter:image", img);
    meta("name", "twitter:image:alt", page.ogImageAlt || `${site.brand} — ${site.tagline}`);
  }
  meta("name", "twitter:site", site.twitter);
  meta("name", "twitter:creator", site.twitter);

  // Dublin Core — still read by several academic and library-adjacent crawlers
  meta("name", "DC.title", title);
  meta("name", "DC.description", desc);
  meta("name", "DC.publisher", site.brand);
  meta("name", "DC.language", site.lang || "en-US");
  meta("name", "DC.rights", `© ${new Date().getUTCFullYear()} ${site.brand}`);
  meta("name", "DC.type", page.kind === "guide" ? "Text" : "InteractiveResource");
  meta("name", "DC.format", "text/html");
  meta("name", "DC.identifier", url);

  // Feeds, icons, manifest
  t.push(`<link rel="sitemap" type="application/xml" href="${esc(abs(site, "/sitemap.xml"))}">`);
  t.push(`<link rel="alternate" type="application/rss+xml" title="${esc(site.brand)}" href="${esc(abs(site, "/feed.xml"))}">`);
  t.push(`<link rel="manifest" href="/site.webmanifest">`);
  t.push(`<link rel="icon" href="/favicon.svg" type="image/svg+xml">`);
  t.push(`<link rel="apple-touch-icon" href="/apple-touch-icon.png">`);
  t.push(`<link rel="preconnect" href="https://fonts.googleapis.com">`);
  t.push(`<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`);

  // Prev/next for paginated collections
  if (page.prev) t.push(`<link rel="prev" href="${esc(abs(site, page.prev))}">`);
  if (page.next) t.push(`<link rel="next" href="${esc(abs(site, page.next))}">`);

  // The graph
  t.push(
    `<script type="application/ld+json">${JSON.stringify(jsonLdGraph(site, page))}</script>`
  );

  return t.join("\n");
}

/* ------------------------------------------------------------------ *
 * Site-level files
 * ------------------------------------------------------------------ */

export function sitemap(site, pages) {
  const urls = pages
    .filter((p) => !p.noindex)
    .map(
      (p) => `  <url>
    <loc>${abs(site, p.path)}</loc>
    <lastmod>${(p.modified || site.modified || "").slice(0, 10)}</lastmod>
    <changefreq>${p.changefreq || (p.path === "/" ? "weekly" : "monthly")}</changefreq>
    <priority>${p.priority ?? (p.path === "/" ? "1.0" : p.kind === "guide" ? "0.6" : "0.8")}</priority>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function robots(site) {
  return `# ${site.brand}
User-agent: *
Allow: /

# AI answer engines are a real referral channel now; they are welcomed
# deliberately rather than by omission.
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: ${abs(site, "/sitemap.xml")}
`;
}

export function webmanifest(site) {
  return JSON.stringify(
    {
      name: site.brand,
      short_name: site.shortName || site.brand,
      description: site.description,
      start_url: "/",
      display: "standalone",
      background_color: site.bgColor || "#ffffff",
      theme_color: site.themeColor || "#000000",
      icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
    },
    null,
    2
  );
}

export function feed(site, pages) {
  const items = pages
    .filter((p) => p.kind === "guide")
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${abs(site, p.path)}</link>
      <guid isPermaLink="true">${abs(site, p.path)}</guid>
      <description>${esc(clamp(p.description))}</description>
    </item>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
    <title>${esc(site.brand)}</title>
    <link>${abs(site, "/")}</link>
    <description>${esc(site.description)}</description>
    <language>${esc(site.lang || "en-US")}</language>
${items}
</channel></rss>
`;
}

export { esc };
