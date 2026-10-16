# UX/UI best practices for a mobile-first animated digital-bouquet store (France, 50–75 Facebook users + young TikTok couples): sourced notes as of 2 October 2026

**How these notes were made**
- **Date and tools:** compiled on **2026-10-02** with WebSearch/WebFetch, plus the Claude desktop browser pane for pages that need JavaScript to render.
- **Sources:** roughly 350 tool calls in total (searches, page fetches and browser actions), run across parallel research passes. All pages were accessed on 2026-10-02.
- **Competitor flows:** I walked through them myself on 2026-10-02 in a **375×812 mobile viewport**: DigiBouquet, theBouquet, Attached, and the public landing page of Flowers/FlowerIsBlooming. I stopped every flow **before** any "send/publish/create link" action, and nothing was submitted.
  - flowerisblooming.com's footer says AI agents may not scrape, copy or reverse-engineer it, so observation there was limited to its public landing page.
  - App Store data comes from the official listing pages and the iTunes customer-review RSS.

**Tags used in this document**
- **(older: YEAR)**: source published before 2022.
- **[snippet only]**: claim seen only in a search-result summary, not on the fetched page.
- **[vendor claim]**: unaudited marketing figure.
- **(observed)**: my own observation on 2026-10-02.

**Structure**
- Each question has four parts: Takeaway, Cited Findings, Inferences (my reasoning for *this* product, not evidence), and Gaps.
- The last section gives the **15 most actionable recommendations**, each tied to sources.

**Product context assumed throughout**
- French founder.
- About 80% mobile traffic, often inside the Facebook, Messenger or WhatsApp in-app browsers.
- Library of thousands of animated-SVG species and variants. The founder wants a colour-coded library and a "garden corridor", not a SKU list.
- Occasion presets with automatic foliage and filler.
- Per-flower prices from a few cents to tens of cents. Bouquets cost €5–20 with options (message, music, vase).
- Payments through Stripe.

---

## 1. Product configurators and builders on mobile: live preview, progressive disclosure, presets, undo, step count, abandonment; florist and digital-bouquet builders

### Takeaway
I found no public Baymard or NN/g study that measures configurators directly. The best-supported rules are:
- start people from a few good templates ("starting solutions"), not a blank canvas;
- disclose options in two levels only;
- use a named-step wizard for novices and infrequent tasks, and save progress;
- make undo visible;
- show the all-in price at all times.

Peer-reviewed work agrees on four points:
- Starting from a pre-made solution and then refining it gives higher satisfaction and richer purchases.
- Self-designed items earn a 44–62% higher willingness to pay, but only when the result looks good.
- For gifts, design help that raises the giver's expectations backfires when the delivered gift disappoints.
- AI-generated help reduces the maker's sense of accomplishment.

Major florists mostly avoid open per-stem builders. Aquarelle's "100% sur-mesure" was 5% of revenue in 2022, and Interflora UK ran a builder with colour and meaning filters and a running total in 2013. Free digital-bouquet tools already set the bar at 3–4 screens with no account. The closest benchmark (DigiBouquet) has users pick 6–10 blooms, then auto-arranges them with greenery and a "Try a new arrangement" button.

### Cited Findings
**Baymard and NN/g**
- **Cart abandonment (Baymard):** the average documented abandonment rate is 70.22% across 50 studies.
  - The reasons a configurator can control are extra costs (40%), not seeing the total up front (12%), forced account creation (18%) and a checkout that is too long (17%). The full table is in §5.
  - The average checkout has 23.48 form elements, against an ideal of 12–14 (7–8 fields).
  - Baymard estimates better checkout design is worth +35.26% conversion.
  - Older roundups still quote 48% / 26% / 25% from an earlier Baymard survey; prefer the current page.
  - — [Baymard, cart-abandonment statistics, updated 2025-09-22](https://baymard.com/lists/cart-abandonment-rate)
- **Baymard's most customizer-heavy vertical, Merchandise & Print-to-Order:** 220+ guidelines, 7 benchmarked sites (VistaPrint, Zazzle, Printful, Custom Ink…). The live-preview and editor guidelines are paywalled. — [Baymard research, n.d.](https://baymard.com/research/merchandise-and-print-to-order)
- **NN/g on wizards:**
  - Suited to novices and infrequent tasks.
  - Show the list of steps and the current one, label buttons with step names rather than "Next", save progress and allow resuming, and pre-fill from earlier choices.
  - Not suited to creative tasks that need user control.
  - — [NN/g, Budiu, "Wizards", 2017-06-25 (older)](https://www.nngroup.com/articles/wizards/)
- **NN/g on progressive disclosure:** move rarely used options to a secondary screen. Two levels work best; more than two usually tests poorly. — [NN/g, Nielsen, "Progressive Disclosure", 2006 (older)](https://www.nngroup.com/articles/progressive-disclosure/)
- **NN/g on configurators:**
  - Configurators are often "miserable" for novices.
  - Avoid blank-slate design. Offer a small set of pre-designed templates that span the design space, keep common changes prominent and put expert options aside.
  - Nielsen predicted, without measuring, that better configurator usability could raise sales 500%.
  - — [NN/g, Nielsen, "Customers as Designers", 2000 (older)](https://www.nngroup.com/articles/customers-as-designers/)
- **NN/g on user control and freedom:**
  - Provide visible multi-level undo and redo (for example a snackbar with "Undo").
  - The browser Back button must not lose work in multi-step flows.
  - Offer an explicit Cancel and warn before data loss.
  - — [NN/g, Rosala, "User Control and Freedom", 2020-11-29 (older)](https://www.nngroup.com/articles/user-control-and-freedom/)
- **Live-preview uplift figures:** the "+25–40% conversion" and "30–50% fewer returns" claims for live previews are untraceable vendor numbers. — [Kickflip blog, vendor claim, snippet only](https://gokickflip.com/blog/what-are-major-features-of-product-configurator); [3D Cloud, vendor claim, snippet only](https://3dcloud.com/product-configurator-examples/)

**Peer-reviewed mass-customisation research**
- **Starting solutions** (Hildebrand, Häubl & Herrmann 2014, JMR 51(6)):
  - Customers pick one pre-made starting product, then refine it.
  - Across 9 experiments (3 in the field), this gave higher satisfaction, lower perceived complexity and better simulation of using the product.
  - Customers also chose more feature-rich, higher-priced products.
  - Products tested: shirts, cars, holidays, jewellery and financial products.
  - — [Univ. St. Gallen repository record, 2014 (older)](https://www.alexandria.unisg.ch/236290)
- **Order of decisions** (Levav, Heitmann, Herrmann & Iyengar 2010, JPE 118(2)): in suit and car configurators, the order of attributes changed what people bought by changing how often they accepted defaults. After large choice sets, people accept more defaults later. — [IDEAS/RePEc, 2010 (older), snippet only](https://ideas.repec.org/a/ucp/jpolec/v118y2010i2p274-299.html)
- **Small-to-large ordering** (Levav, Reinholtz & Lin 2012, JCR, 5 studies): moving from small to large choice sets triggered a "maximizing" mindset, with deeper search and *lower* satisfaction. Study 1: n=49, a 10-track CD built from sets of 5–50 songs. — [Levav, Reinholtz & Lin 2012 PDF (older)](https://reinholtzresearch.com/files/Levav_Reinholtz_&_Lin_2012.pdf)
- **"I designed it myself" effect** (Franke, Schreier & Kaiser 2010, Management Science), measured with binding bids:
  - T-shirt: €6.85 self-designed vs €4.75 off-the-shelf (about +44%, n=114).
  - Skis: €74.42 vs €45.89 (about +62%, n=116). The premium is explained by feeling of accomplishment, not effort.
  - The premium was €4.90 when the design fit preferences vs €1.94 when it fit poorly (n=129).
  - More design freedom raised value: €30.34 vs €19.21 (watches, n=66).
  - — [Franke, Schreier & Kaiser 2010 PDF (older)](https://www.wu.ac.at/fileadmin/wu/d/i/entrep/4_forschung/full-text-papers/franke_schreier_kaiser_2010_designed_it_myself.pdf)
- **Customised gifts** (Moreau, Bonney & Herd 2011, Journal of Marketing):
  - Givers bid more for customised gifts than for themselves ($28.11 vs $25.52).
  - Effort correlated with willingness to pay for gifts (r=.41) but not for self.
  - Design support lowered givers' anxiety and raised expectations. At delivery, givers who had support were *more* disappointed (−1.4 vs −0.3) and bid less ($26.13 vs $30.58).
  - — [Moreau, Bonney & Herd 2011 PDF (older)](https://www-business.media.uconn.edu/wp-content/uploads/sites/969/2018/04/2011_JM_Its-the-Thought-That-Counts.pdf)
- **Sequential defaults** (Donkers, Dellaert, Waisman & Häubl 2020, JMR): passively accepting a default weakens carry-over between choices, and high-price defaults can backfire. Evidence comes from 3 experiments plus a carmaker's online configurator. — [Donkers et al. 2020 PDF (older)](https://repub.eur.nl/pub/131000/JMR-Sequential-Defaults-1.pdf)
- **Generative AI in self-design** (Pflanzer & Spann 2025): AI design help *lowered* the subjective value of a self-designed product, through reduced accomplishment. The sample size is not given in the abstract. — [EMAC 2025 proceedings PDF](https://proceedings.emac-online.org/pdfs/A2025-124513.pdf)
  - When the human initiates the creation, people feel more ownership. — [ICIS 2025, snippet only](https://aisel.aisnet.org/icis2025/gen_ai/gen_ai/29/)
- **Interface type and complexity:**
  - Choosing attribute by attribute gave less difficulty and more satisfaction than choosing among whole alternatives (Valenzuela et al. 2009). — [URL/ESADE record (older), snippet only](https://merit.url.edu/en/publications/contingent-response-to-self-customization-procedures-implications/)
  - Novices do better with needs-based interfaces than parameter-based ones (Randall et al. 2007). — [IDEAS/RePEc (older), snippet only](https://ideas.repec.org/a/inm/ormksc/v26y2007i2p268-280.html)
  - Complexity lowers the value of customisation (Dellaert & Stremersch 2005). — [author PDF (older), snippet only](https://personal.eur.nl/stremersch/artikels/Marketing%20Mass-Customized%20Products%20Striking%20a%20Balance%20Between%20Utility%20and%20Complexity.pdf)
- **IKEA effect:** valuation rises only when the build is completed. — [Norton, Mochon & Ariely 2012, SSRN (older), snippet only](https://papers.ssrn.com/abstract=1777100)

**Consumer configurator case studies**
- **LEGO "Create a Minifigure" beta** (launched 2025-03-25, UK, mobile-optimised):
  - Parts are listed from cheapest to most expensive, with prices clearly shown.
  - One-tap duplication of a whole figure; up to 40 figures per order.
  - High-resolution images "take a moment to load".
  - — [New Elementary, March 2025](https://www.newelementary.com/2025/03/pick-brick-create-minifigure-online-uk.html)
- **LEGO Pick a Brick** now groups a part's colour variants together and adds tag search (e.g. "orange legs"). — [Brick Fanatics, 2025, snippet only](https://www.brickfanatics.com/new-lego-pick-brick-pieces-updates-revealed)
- **Build-A-Bear** names 7 ritual steps: Choose Me → Hear Me → Stuff Me → Hug Me → Dress Me → Name Me → Take Me Home. Voice recordings of up to 30 s can be made from the buyer's device. — [Build-A-Bear "The Workshop Experience", snippet only](https://www.buildabear.com/brand-about-story-experience.html); [Record your voice, snippet only](https://www.buildabear.com/record-your-voice)
- **Nike By You** remains selective in 2026. The Zellerfeld × Air Max 1000.3 "By You" (Fall 2026, nike.com only) is expected to offer a few levers, base colour and Air-unit colour, at $200+. Earlier, in 2024, Mercurial boots were slow to be added. — [Sneaker News, 2026-08-06](https://sneakernews.com/2026/08/06/zellerfeld-nike-by-you-air-max-1000-3/); [Footy Headlines, Oct 2024, snippet only](https://www.footyheadlines.com/2024/10/nike-to-stop-allowing-custom-boot-creation.html)
- **IKEA Kreativ** (AI room design, June 2022) is reported not to cover all furniture (e.g. kitchens) and to scan rooms from a single angle. — [TechCrunch, 2022-06-22, snippet only](https://techcrunch.com/2022/06/22/ikea-rolls-out-an-ai-powered-interactive-design-experience-for-shoppers/embed/); [Antyweb, snippet only](https://antyweb.pl/ikea-kreativ-projektowanie-pomieszczen-aplikacja)

**Florist "build your own bouquet"**
- **Aquarelle (France):**
  - Launched a "bouquet 100% sur-mesure" in 2021: customers choose flower bunches and quantities, assembled by a florist or as a DIY kit.
  - It reached 5% of revenue by 2022.
  - Aquarelle prepared more than 1M bouquets on €45M revenue in 2021; under-35 customers rose from 33% (2018) to 44% (2021).
  - — [La Gazette France, 2023-06-23](https://www.lagazettefrance.fr/article/aquarelle-com-l-eternel-pouvoir-des-fleurs)
  - In 2026, product pages instead use stem-count variants (e.g. 25 roses €29.90 → 45 roses €49.90). — [Aquarelle, snippet only](https://www.aquarelle.com/shop/mini-prices)
- **Interflora UK "My Interflora Creation" (2013):**
  - Drag-and-drop builder with 70+ varieties plus foliage, filterable **by colour, type or symbolic meaning**.
  - A **running total** updated with each stem.
  - The result could be sent as an e-card or delivered; from £15, plus £5.99 delivery.
  - — [Lavender & Lovage blog, 2013-01-11 (older)](https://www.lavenderandlovage.com/2013/01/a-floral-fantasy-design-and-deliver-your-own-floral-bouquet-on-line.html)
- **UrbanStems:** "we cannot customize orders". Its photos are "slightly more styled" than reality, and stems may be substituted. — [UrbanStems Help Center, updated about Feb 2026](https://help.urbanstems.com/en-US/can-i-customize-my-bouquet-1959262)
- **Other florists:**
  - FLOWERBX sells single varieties in stem counts (10/20/50/100); mixes go through its team. — [FLOWERBX, snippet only](https://www.flowerbx.com/how-to-choose-flowers)
  - The Bouqs offers build-your-own only in local shops. — [The Bouqs LA, snippet only](https://bouqs.com/local/los-angeles-ca)
  - Euroflorist offers single-stem bundles of 5/10/15. — [Euroflorist SE, snippet only](https://www.euroflorist.se/en/category/flowerse/singlestem)
- **Abigail Ahern (UK, faux flowers):**
  - A 4-step builder by flower role: Statement stems → Complementary stems → Foliage & berries → Branches.
  - Size bands: under £100 (about 4–8 stems), £100–250 (about 8–18), over £250 (18+).
  - — [abigailahern.com, Bouquet Builder](https://abigailahern.com/pages/bouquet-builder)
- **Digital bouquet tools:**
  - onlinebouquet.com has 3 steps (Pick flowers: 8 blooms with colour options → Write card → Share link) plus 6 featured ready-made bouquets to customise, with no account. — [onlinebouquet.com, ©2026](https://onlinebouquet.com/)
  - "Build A Bouquet" (iOS, $1.99) is a free-form drag/rotate/resize editor rated 3.0★ (4 ratings). — [AppFollow, snippet only](https://apps.appfollow.io/ios/build-a-bouquet/531107712?country=us)

**Existing digital-bouquet builders: direct observation (2026-10-02, 375×812 mobile viewport)**

| Builder | Flow and step count (observed) | Library and browsing | Arrangement and undo | Monetisation and friction seen |
|---|---|---|---|---|
| **DigiBouquet** – [digibouquet.vercel.app](https://digibouquet.vercel.app/) | Landing (3 CTAs: colour build, black-and-white build, "View garden") → **1. "Pick 6 to 10 blooms"** → **2. "Customize your bouquet"** → **3. "Write the card"** → link (I stopped before generating a link). About 10 taps plus typing. | **12 flower types** (orchid, tulip, dahlia, anemone, carnation, zinnia, ranunculus, sunflower, lily, daisy, peony, rose) as large watercolour tiles in a scrolling 2-column layout. Tapping again adds a duplicate; a numbered badge shows the count per flower. | Selected flowers appear as chips ("ROSE x2"); tapping a chip removes it. NEXT stays disabled until 6 blooms are chosen. Step 2 is **automatic composition with greenery**: there is no manual drag, only **"Try a new arrangement"** (reshuffle) and **"Change greenery"**. The card is a "Dear … / message / Sincerely …" template. | Free; no prices, no account. A public "garden" shows recent bouquets with dates (not clickable). |
| **theBouquet** – [thebouquet.me/create](https://thebouquet.me/create) | Landing → free-form **canvas editor** → "Share Gift" opens a **6-step modal wizard**: 1 Message → 2 Recipient → 3 Card style → 4 Music → 5 Security → 6 Review → "Wrap & Send Gift". At least ~12 taps beyond the flower picking. | **8 tabs** (Templates, Wrappers, Flowers, Fillers, Accessories, Seasonal, Others, Images). Counts read from the DOM: 12 templates, 60 wrappers/vases, **85 flowers** (colour variants are separate items, e.g. Red/Pink/White Rose), 34 fillers, 73 accessories, 51 seasonal, 61 others (**≈376 items**). Each tab is a **single horizontal row** of ~80×88 px tiles, with about 3.5 visible at 375 px. **No search box and no colour filter.** | Tapping an item drops it at the canvas centre with 8 resize handles plus a rotate handle; layer controls (front/up/down/back), delete, and **Undo/Redo**; Save Draft / My Drafts. A visual glitch let the selection handles render above the share modal. | Freemium. The message requires **at least 10 characters**, with a 500-character free cap ("unlock up to 10,000"). Voice notes, email delivery, music (7 tracks, one tagged "Most popular"), PIN lock and permanence are Supporter-only: **upsells on 5 of 6 wizard steps**. The Review step needs 2 mandatory checkboxes ("I confirm this is my final design" — no edits after publishing; accept T&C), offers an opt-in public showcase, and warns that "This bouquet expires in 14 days". |
| **Attached** – [attachedapp.com/digital-bouquet](https://www.attachedapp.com/digital-bouquet) → [/send-virtual-flowers/edit](https://www.attachedapp.com/send-virtual-flowers/edit) | Landing ("Free, No Signup"; "1. Design your bouquet 2. Add your note 3. Send the link"; counter "129 518 bouquets sent"; "Takes under 3 minutes") → **3 steps with an icon progress bar**: 1 "Pick a bush" → 2 "Wrap your bouquet" → 3 "Write a message" → link (not executed). About 6–7 taps plus typing. | **Garden metaphor**: a full-screen illustrated rose bush with **6 named colour swatches** (Soft White, Classic Red, Blush Pink, Sunset Coral, Lavender, Midnight). Each swatch recolours the bush live, and "Next" appears only after a choice. There is no flower-by-flower choice. | Step 2 offers 3 wraps (Kraft, Satin, Purple Tissue) plus 3 bows. An animated transition moves the flowers from the bush into the wrap. Step 3 has a relationship selector (partner/family/friend/co-worker), To/From fields (max 120 characters) and a message field (max 2,000 characters). | Free (lead-gen for a relationship app). There are 25 occasion landing links for SEO and a shared "garden". |
| **Flowers / FlowerIsBlooming** – [flowerisblooming.com](https://flowerisblooming.com/) (public landing page only) | The landing page is auto-localised to French ("Le meilleur cadeau numérique qui dure pour toujours"). It promises a private gift composed in the browser with a **permanent link and QR code**. "Choose how their gift begins" offers a catalogue of openings, locks and "gift worlds" with previews (e.g. "Pastel Fireworks"). It also links a "Gift message helper" and a free photobooth. | The app advertises **403 hand-drawn flowers** to collect, a "Fleur du jour" and a garden or collection to arrange. | n/a (the composer was not examined). | The site footer says AI agents may not scrape, copy or reverse-engineer it without written permission. I respected this and **limited observation to the public landing page**. US App Store reviews (6, May–Sep 2026, all 5★) praise the volume of templates ("prob 400+ templates"). — [App Store reviews RSS](https://itunes.apple.com/us/rss/customerreviews/page=1/id=6761077139/sortby=mostrecent/json) |
| **Bloom: Flower Arrangement** (iOS, AR) – [App Store](https://apps.apple.com/us/app/bloom-flower-arrangement/id6744581621) | Pick flowers and vases → arrange → place in your room with AR → share as an image (per the listing). | IAP **$0.99 each** for 4 flowers and 6 vases. | n/a | 3.7★ (3 ratings). A 1★ review (2025-12-04) complains of "only 3 flowers to choose from" unless you pay $0.99 per flower or vase, and judges it "not even worth paying $20". The next update (v1.5.2, April 2026) reads "More flowers are now free to arrange — no unlock needed". — [reviews RSS](https://itunes.apple.com/us/rss/customerreviews/page=1/id=6744581621/sortby=mostrecent/json) |


- **Flower counts differ between sources.** The original digibouquet.vercel.app offered **12** flower types on 2026-10-02 (observed). The separate digibouquet.net site and some press describe **8**. — [digibouquet.net/about, snippet only](https://digibouquet.net/about)
- **Friction patterns in the free tools (observed):**
  - **theBouquet** uses a free canvas with tiny resize and rotate handles, about 376 items in single-row horizontal shelves with no search, and a 6-step share wizard with an upsell on 5 steps. — [thebouquet.me/create](https://thebouquet.me/create)
  - **DigiBouquet** requires a minimum of 6 blooms before "Next" activates, and offers no per-flower colour choice. — [digibouquet.vercel.app](https://digibouquet.vercel.app/bouquet?mode=color)
  - **Attached** offers almost no choice (a single bush colour), and its "Next" button appears only after a selection. — [attachedapp.com editor](https://www.attachedapp.com/send-virtual-flowers/edit)

### Inferences
- **Default path:** occasion → a suggested bouquet (the starting solution) → "Personnaliser" → message, music and vase → full-screen preview → pay. That is **4–5 named steps** with a step indicator and saved progress.
  - Keep the free flower-by-flower builder and the "garden corridor" as a *secondary* creative mode. NN/g says wizards fit creative tasks poorly, so this mode should be free-form rather than a wizard, and it should not be where novices start.
  - Aquarelle's sur-mesure builder at 5% of revenue suggests most buyers will stay on presets.
- **Encode the florist's recipe as roles.** The user chooses focal flowers. The system adds complementary flowers, foliage and filler, shown as visible, removable "finishing touches" and labelled as included.
  - This mirrors Abigail Ahern's role-based steps and DigiBouquet's automatic greenery.
  - It keeps the user as author (Franke; Pflanzer & Spann).
  - It makes every state a finished-looking bouquet, which matters because the IKEA effect requires completion.
- **Slot-based composition, not a free canvas.**
  - Tap a flower to add it to the next free slot.
  - Tap a placed flower to get big "Remplacer / Retirer / Couleur" buttons.
  - Use "Une autre disposition" (DigiBouquet's "Try a new arrangement") to rearrange instead of drag, resize and rotate (theBouquet).
  - This satisfies WCAG 2.5.7 (no drag-only operation, see §5) and avoids precision handles for users aged 50–75.
- **Undo:** show selected flowers as removable chips ("Rose ×2", as DigiBouquet does), a snackbar "Annuler" after every add or remove, and "Revenir à la suggestion".
  - Persist the bouquet state in the URL or on the server so Back, app switching or a WebView reload loses nothing (NN/g user control).
- **Bound quantity:** S/M/L sizes (for example 5 / 9 / 15 focal stems, auto-filled) rather than an open count. Physical-florist builders all use bundles or size bands.
  - Prefer odd focal counts; see the French etiquette note in §4.
- **The preview must be the recipient's exact rendering** (same engine, same animation) and appear before payment.
  - Moreau et al. show that a gift falling short of the giver's raised expectations destroys value.
  - A digital product can guarantee this match, unlike florists who substitute stems (UrbanStems).
- **Keep the live total on screen at all times** (40% of abandonment is extra costs; 12% is not seeing the total). Pricing design is covered in §3.

### Gaps
- Baymard's paywalled customisation guidelines (live-preview requirements, the share of sites failing them) were not accessible.
- No NN/g configurator article newer than 2000 was found.
- No research-backed optimal step count for configurators.
- Effect sizes were not retrieved for Levav et al. 2010 or Hildebrand et al. 2014.
- No peer-reviewed study on mobile or in-app-browser configurators, or on customising *digital* gifts.
- No verified conversion or return data for Nike By You, IKEA, LEGO or Build-A-Bear. A widely repeated Nike "30% lower returns / +22% demand" claim traces only to a low-quality page and should not be used.
- The Interflora FR/UK, Bloom & Wild, Moonpig, 1-800-Flowers and Bergamotte sites were not walked through. The absence of current builders there rests on domain-restricted searches.
- Whether Aquarelle's sur-mesure builder is still live in 2026 is unverified.
- No usage, conversion or retention numbers exist for DigiBouquet, theBouquet or Attached beyond their own counters ("300k+ sent", "129 518 bouquets sent").

---

## 2. Browsing very large visual libraries without lists: colour and visual facets, search, grids vs carousels vs shelves, infinite scroll vs "load more", spatial "garden corridor" metaphors, game inventories and rarity tiers

### Takeaway
**Colour as the entry point.** Colour can be a primary way into the library, but only as coarse, *named* families (each swatch carries a text label). Never use colour as the only cue. About 1 in 12 men have a colour vision deficiency, and the ability to tell similar colours apart declines with age, most on the blue–yellow axis, which matters for a 50–75 audience.

**Layout.** For thousands of items the evidence favours a vertical grid of static thumbnails loaded in batches behind a "load more" button, rather than infinite scroll or horizontal carousels. Material Design 3 says carousels on scrolling pages must have a "Show all" vertical alternative, and can show only about 3 items at once on a phone.

**The "garden corridor".** A walkable corridor is weakly supported as primary navigation:
- adding a third dimension hurt retrieval in classic studies;
- immersion raises enjoyment but lowers the ability to judge products;
- NN/g finds parallax and scrolljacking disorienting;
- vestibular dysfunction affects about 35% of adults aged 40+.

Use the corridor as an optional, discrete-step "stroll" mode on top of the grid.

**Games** handle big collections with a catalogue or log, sort/filter, and a stable rarity colour ladder (grey/white → green → blue → purple → orange). Cozy flower games signal rarity through how hard an item is to get rather than through labels.

### Cited Findings
**Colour and visual facets**
- **Baymard on visual filters:** add thumbnails to filter labels when attributes differ visually. Photos and illustrations worked equally well, and thumbnails help users who don't know the jargon. About two-thirds of sites use unclear filter wording. — [Baymard, "Use Visual Filters…", 2024-07-09](https://baymard.com/blog/use-visual-filters-for-visually-distinct-product-attributes)
- **Baymard on colour swatches in mobile product lists:**
  - 57% of sites don't show all colour swatches in mobile list items.
  - Horizontally scrolling swatch rows worked: users swiped them naturally, and the last swatch should be visibly cut off.
  - Users disliked opening a product page just to see another colour.
  - Avoid nested scroll areas that hijack page scrolling.
  - — [Baymard, 2023-08-08](https://baymard.com/blog/mobile-interactive-color-swatches)
- **Baymard's 5 "essential" filters:** colour is one of five (with price, ratings, size and brand). 10% of the sites that needed a colour filter lacked one, and 80% of mobile testers tried to filter by price. — [Baymard, "5 Essential Filters", 2020-08-18 (older)](https://baymard.com/blog/5-essential-filters)
- **Interflora France** (accessed 2026-10-02) offers three ways in:
  - "Bouquets par couleurs" with 7 values: Rouge, Multicolore, Blanc, Rose, Orange, Pastel, Violet. "Multicolore" and "Pastel" are moods, not hues.
  - Occasion entries (Anniversaire, Amour, Mariage, Remerciements…) and flower-type entries.
  - The language of flowers appears only as an editorial guide, not as a filter.
  - — [interflora.fr](https://www.interflora.fr/)
- **Bloom & Wild's main listing** showed 273 gifts with only delivery-speed and price filters (no colour facet visible). — [bloomandwild.com/send-flowers](https://www.bloomandwild.com/send-flowers)
- **Interflora UK's 2013 builder** let users pick from 70+ varieties **by colour, type or symbolic meaning**. — [Lavender & Lovage, 2013 (older)](https://www.lavenderandlovage.com/2013/01/a-floral-fantasy-design-and-deliver-your-own-floral-bouquet-on-line.html)
- **Colour-first entry in the bouquet competitors (observed):**
  - Attached opens on a bush with 6 named colour swatches (Soft White, Classic Red, Blush Pink, Sunset Coral, Lavender, Midnight) that recolour the scene live. — [attachedapp.com editor](https://www.attachedapp.com/send-virtual-flowers/edit)
  - theBouquet lists colour variants as separate items (Red/Pink/White Rose) in an 85-item flower row, with no colour filter and no search. — [thebouquet.me/create](https://thebouquet.me/create)
- **Etsy:**
  - Etsy's buyer search filters include **colour**, alongside item type, shop location, ship-to country and others. — [Etsy Help "How to Search for Items and Shops", snippet only (HTTP 403)](https://help.etsy.com/hc/articles/115015627947)
  - The colour filter is built from attributes that sellers enter, so a listing without the colour attribute doesn't appear in colour-filtered results, even if "blue" is in its title. — [getbetterlisting.com Etsy attributes guide, 2026-07-25, snippet only](https://getbetterlisting.com/en/blog/etsy-attributes-seo-metadata-guide-2026-07-25)
- **Colour search elsewhere:**
  - Cooper Hewitt extracts up to 5 representative colours per object and snaps queries to a fixed set of 121 colours. — [Cooper Hewitt Labs, 2013 (older), snippet only](https://www.cooperhewitt.org/2013/03/28/colorforms/)
  - Adobe Stock has a picked-colour/HEX filter plus a "Vivid color" filter (vivid vs muted). — [Adobe Stock Help, snippet only](https://helpx.adobe.com/stock/help/color-and-blur-filters.html)
  - Dulux Visualizer shows a "Colour Wall" of 384 colours laid out by family. — [App Store listing, snippet only](https://apps.apple.com/za/app/dulux-visualizer-za/id973145545)
  - Sherwin-Williams' in-store ColorSnap Studio groups colours by family on 24 panels, from bright to neutral, plus a separate whites category. — [Coatings World, 2015 (older), snippet only](https://www.coatingsworld.com/issues/2015-12-01/view_breaking-news/sherwin-williams-launches-breakthrough-system-to-simplify-color-selection)
- **Pinterest "range" filters:**
  - Body-type ranges (US/Canada, 2023); Pinterest says users of the tool had 66% higher engagement per session. — [Pinterest Newsroom, 2023, vendor claim](https://newsroom.pinterest.com/en-ca/news/pinterests-new-body-type-ranges-deliver-better-more-inclusive-search-results/)
  - Skin-tone ranges (2018) and hair-pattern search (2021, 6 patterns). — [Social Samosa, 2021-08 (older), snippet only](https://www.socialsamosa.com/2021/08/pinterest-hair-pattern-search-inclusive-beauty-results)
- **Colour vision deficiency:** about 1 in 12 men have one; red–green is the most common type, and colour vision can worsen with age, often because of cataracts. — [US National Eye Institute, updated 2025-11-05](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness)
- **Colour discrimination and age** (Costa et al. 2023, n=224, ages 23–68):
  - Discrimination thresholds rose with age on all three axes, with **blue–yellow (tritan) the most affected**.
  - Reported rates are about 1%/year (red–green) vs 1.6%/year (blue–yellow), possibly citing earlier work.
  - The lens absorbs more short-wavelength light after age 40–50.
  - — [Costa et al., Frontiers in Integrative Neuroscience, 2023-03-24](https://www.frontiersin.org/journals/integrative-neuroscience/articles/10.3389/fnint.2023.1129315/full)
- **Hue naming holds up better than fine discrimination:** the appearance of clearly different hues stays largely stable with age, while small-difference discrimination declines. — [Wuerger, PLOS ONE 2013 (older), snippet only](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3648508/)
- **WCAG 1.4.1 Use of Color (Level A):** colour must not be the only visual means of conveying information or distinguishing an element. Older users with reduced colour vision are named among those who benefit. Approved techniques add text, patterns or other visual cues. — [W3C Understanding 1.4.1, updated 2025-09-16](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)

**Layouts for thousands of small visual items**
- **Pagination vs infinite scroll vs "load more" (Baymard testing on 50+ sites):**
  - Pagination: users browsed fewer products.
  - Infinite scroll: users browsed far more (100+ products) but attended less to early results, lost access to the footer, and performed poorly on search results.
  - **"Load more" plus lazy loading** performed best.
  - Recommended mobile batch: **load 15–30 items before a "Load more" button**.
  - More than 90% of sites broke the Back button (fix with history.pushState).
  - — [Smashing Magazine / Baymard, 2016-03-01 (older)](https://www.smashingmagazine.com/2016/03/pagination-infinite-scrolling-load-more-buttons/)
- **NN/g on infinite scroll:** it suits goal-less, uniform feeds. Downsides: hard to re-find items, no footer, accessibility problems, and slow pages and data use on mobile. Alternatives: "Load more" or integrated pagination. — [NN/g, Neusesser, 2022-09-04](https://www.nngroup.com/articles/infinite-scrolling-tips/)
- **Material Design 3 carousels:**
  - On vertically scrolling pages, carousels "require an accessible way to view all the items without horizontally scrolling". Material recommends a **"Show all" button** that opens a vertical page of all items.
  - At compact (phone) breakpoints, carousels "can comfortably show up to three carousel items at once"; more only if items are easy to recognise.
  - Small items are 40–56 dp wide.
  - Snap scrolling is recommended for multi-browse layouts.
  - — [Material Design 3, Carousel guidelines, read 2026-10-02](https://m3.material.io/components/carousel/guidelines)
- **Carousel usability problems:**
  - NN/g notes low discoverability and one-at-a-time viewing on touch screens. — [NN/g mobile topic listing, snippet only](https://www.nngroup.com/topic/mobile-and-tablet-design/?page=4)
  - Baymard finds 33% of sites have a homepage carousel and 46% of those have UX issues. — [Baymard, homepage carousel, snippet only](https://baymard.com/blog/homepage-carousel)
- **Horizontal shelf at scale (observed):** theBouquet shows 85 flowers, 60 wrappers, 73 accessories and so on, each in a single horizontal row with about 3.5 tiles visible at 375 px. Seeing all flowers takes roughly 24 swipes, and there is no search. — [thebouquet.me/create](https://thebouquet.me/create)
- **Search failures:**
  - 70% of top-50 sites couldn't handle product-type synonyms, and 34% failed on a one-character misspelling. — [Smashing / Baymard, 2014-08-18 (older), snippet only](https://www.smashingmagazine.com/2014/08/18/the-current-state-of-e-commerce-search/)
  - 80% offer autocomplete but only 19% perform well. — [Baymard search report, snippet only](https://baymard.com/blog/ecommerce-search-report-and-benchmark)
- **Emoji pickers, a proven model for about 4,000 tiny glyphs:**
  - Unicode 18.0 has **3,972 emoji**. — [Unicode Emoji Counts v18.0](https://www.unicode.org/emoji/charts/emoji-counts.html)
  - The iPhone emoji keyboard combines "Search Emoji", a "Frequently Used" tab (clock icon) and **touch-and-hold for skin-tone variants**. — [Apple Support 102507, snippet only](https://support.apple.com/102507)
  - EmojiZoom, a zoomable 2-D map, made entry up to 18% faster. — [arXiv 2409.17322 review citing EmojiZoom (older: 2016), snippet only](https://arxiv.org/pdf/2409.17322)
- **Hidden gestures:** swipe, long-press and double-tap actions have no visible affordance. — [GhostUI, arXiv 2601.19258, 2026, snippet only](https://arxiv.org/pdf/2601.19258)

**Spatial and immersive navigation ("garden corridor", 2.5D, 3D stores)**
- **Cockburn & McKenzie (CHI 2002):** retrieval performance fell in both physical and virtual systems as the freedom to use the third dimension grew, and users rated 3D interfaces more cluttered and less efficient. — [CHI 2002 paper (course copy) (older), snippet only](https://courses.washington.edu/hcde511/a14/readings/cockburn-chi02.pdf)
- **Data Mountain** (a tilted 2.5D plane) beat browser Favorites for retrieving documents using spatial memory. — [Robertson et al., UIST 1998, Microsoft Research (older)](https://www.microsoft.com/en-us/research/publication/data-mountain-using-spatial-memory-for-document-management/)
- **Peukert et al. 2019 (JMIS):** a VR store vs a desktop 3D store showed no net effect of immersion on intention to reuse. Enjoyment gains were cancelled out by a lower ability to judge products, attributed to poor readability of product information. — [JMIS 36(3) (older), snippet only](https://jmis-web.org/articles/1443)
- **360° virtual store (2022, n=587):** sensory cues improved experience and time spent, mostly for *browsers* rather than people searching for something. — [HICSS / ScholarSpace, snippet only](https://scholarspace.manoa.hawaii.edu/items/e0499914-bc90-4424-920d-1c644920ad67/full)
- **Obsess (virtual-store vendor):**
  - Claims 2× session time, +26% average order value, +75% conversion, and "up to 80% higher" AOV. — [Obsess NRF24 PDF, vendor claim, snippet only](https://assets.dm.ux.sap.com/noam-nrf/pdfs/obsess-nrf24.pdf); [eMarketer 2025, snippet only](https://www.emarketer.com/content/infinite-reality-buys-obsess-3d-virtual-shopping-metaverse)
  - Obsess was bought by Infinite Reality in January 2025, and obsessar.com now redirects to napster.ai/enterprise (observed 2026-10-02). — [Auganix, snippet only](https://www.auganix.org/?p=16646)
- **NN/g on parallax:**
  - Parallax causes slow loads and blank screens, makes goal-focused users miss content, and moving text can be dizzying.
  - Apple added Reduce Motion in iOS 7 after reports of vertigo and nausea.
  - Keep parallax for leisure browsing and backgrounds only.
  - — [NN/g, "What Parallax Lacks", 2019-01-20 (older)](https://www.nngroup.com/articles/parallax-usability/)
- **NN/g on scrolljacking:** most participants were at least mildly disoriented, task-focused users were highly annoyed, and it is worse on mobile. Leave it out on mobile and never change the scroll direction. — [NN/g, "Scrolljacking 101", 2023-08-06](https://www.nngroup.com/articles/scrolljacking-101/)
- **Vestibular dysfunction** (Agrawal et al. 2009, NHANES):
  - 35% of US adults aged 40+ have it, rising from 18.5% in their 40s to 85% at 80+.
  - People who also report dizziness have 12× the odds of falling.
  - — [PubMed 19468085 (older), snippet only](https://pubmed.ncbi.nlm.nih.gov/19468085)
- **Apple HIG Motion** (visionOS guidance): avoid making the whole surrounding area appear to move, keep a stationary frame of reference, avoid rotating the world, and avoid sustained oscillation around 0.2 Hz. More in §7. — [Apple HIG Motion, change log to 2025-09-09](https://developer.apple.com/design/human-interface-guidelines/motion)
- **WCAG 2.3.3 Animation from Interactions (AAA):** motion triggered by interaction must be possible to switch off, and parallax is the main example. — [W3C Understanding 2.3.3, updated 2025-09-16](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

**Games: large collections and rarity tiers**
- **Animal Crossing: New Horizons, flowers:**
  - 8 species, each in several colours.
  - Hybrids appear as buds after watering.
  - Gold roses require watering black roses with a golden can; blue roses need specific breeding lines.
  - The game does not label rarity; it shows through difficulty and community knowledge.
  - — [Nookipedia "Flower"](https://nookipedia.com/wiki/Flower)
- **Animal Crossing: New Horizons, Nook Shopping:** the catalogue shows items the player has obtained, and a daily selection rotates up to about 11 items. — [Nookipedia "Nook Shopping"](https://nookipedia.com/wiki/Nook_Shopping)
- **World of Warcraft item-quality colours:**
  - Poor grey #9d9d9d, Common white #ffffff, Uncommon green #1eff00, Rare blue #0070dd, Epic purple #a335ee, Legendary orange #ff8000, Artifact light gold #e6cc80.
  - Quality is shown by the colour of the item's name text.
  - — [Warcraft Wiki "Quality", updated 2026-09-10](https://warcraft.wiki.gg/wiki/Quality)
- **Origin of the rarity ladder:** it runs from Diablo (1996) to Diablo II (2000) to WoW (2004), and most loot games (Borderlands, Destiny, Fortnite…) build on WoW's ladder. — [Wikipedia "Loot (video games)", edited 2026-07-25](https://en.wikipedia.org/wiki/Loot_(video_games))
- **Old School RuneScape collection log** (2018, still live): 1,925 slots grouped into tabs, with milestone rewards from 100 items up to about 90% completion. — [OSRS Wiki "Collection log"](https://oldschool.runescape.wiki/w/Collection_log)
- **Garden Life: A Cozy Simulator (2024):** villagers request specific flowers and players sell bouquets. A review notes inventory management can be time-consuming. — [PlayStation Country review, snippet only](https://www.playstationcountry.com/garden-life-a-cozy-simulator-ps5-review/)
- **Strange Horticulture:** players identify about 80 plants using an in-game encyclopedia (the "Strange Book of Plants"). — [Hardcore Gamer review, snippet only](https://hardcoregamer.com/reviews/review-strange-horticulture/417833/)
- **Wylde Flowers:** the official help page only says that forageable items can also be bought from shopkeepers whose stock rotates, the same rotating-shop pattern as Nook Shopping. It does not document the inventory UI. — [wyldeflowersgame.com/help](https://wyldeflowersgame.com/help.html)
- **Flowers app (FlowerIsBlooming):** pitches "403 fleurs dessinées à la main" to collect, a "Fleur du jour" and a garden (observed). — [flowerisblooming.com](https://flowerisblooming.com/)

### Inferences
- **Information architecture: species cards, not SKUs.**
  - One card per species, with colour variants as a swatch row on the card (last swatch cut off) or in a bottom sheet.
  - Never one card per variant: theBouquet's "Red/Pink/White Rose" pattern multiplies the cards to browse.
  - Never variants hidden behind long-press only. Show a visible "+3 couleurs" chip.
- **Primary facets, each a swatch or thumbnail plus a French label:**
  - **Colour family**, about 8–12 named families plus "Multicolore" and "Pastel/Vif". Snap each SVG's dominant fill to a family automatically (the Cooper Hewitt approach). Don't make users separate lilac from lavender or cream from pale yellow; those blue–yellow and violet distinctions are the ones that decline with age.
  - **Occasion.**
  - **Message/meaning** (amour, merci, courage, pardon). This is untested, but no florist filters by meaning today.
  - **Shape**, using silhouettes (round, spiky, bell, cluster).
- **Layout:**
  - A vertical 2–3-column grid of static thumbnails, with "Voir plus" after about 15–30 items and a visible total ("312 fleurs").
  - Keep scroll position on Back; test this inside the in-app browsers.
  - Horizontal shelves only on the discovery screen ("Rares du moment", "Récemment choisies", one shelf per colour), each ending in "Tout voir" → grid, per Material 3.
  - A "Récentes / Favoris" tray, emoji-style.
- **Garden corridor as a "Balade" mode:**
  - One aisle per colour family, with fixed slots so spatial memory works.
  - Move bay by bay with tap or arrow buttons and a short cross-fade, never continuous camera motion or scroll-linked parallax.
  - Instant transitions under reduced motion.
  - A persistent "Vue grille" toggle.
  - Keep flower sway low-amplitude and not synchronised. Apple's 0.2 Hz oscillation warning comes from visionOS and is extrapolated here.
- **Rarity:** 3–4 price-linked tiers shown on the card *frame or badge*, never by tinting the flower, because the flower's colour is the content.
  - Each tier needs a word plus an icon ("Commune / Rare / Précieuse / Légendaire", or bronze/argent/or), to satisfy WCAG 1.4.1.
  - Signal rarity by story ("la rose bleue") rather than artificial difficulty.
- **Collection:** an "Herbier" log of species sent and received, with milestone badges, and undiscovered species shown as silhouettes labelled "à découvrir".
- **A daily curated way in:** a "Jardin du jour" with about 10 flowers.

### Gaps
- Not verified on the pages themselves: Etsy's colour filter (snippet-level only; help.etsy.com blocked the fetch), Pinterest palette or visual search (only the range filters were found), and Pantone Connect.
- Baymard's guideline on colour-filter design (swatch plus text, shade grouping) is likely paywalled and was not read.
- Baymard's 2022–2026 pagination data and its mobile horizontal-slider guideline were not accessed; only the 2016 results were.
- No 2022–2026 peer-reviewed study compares a smartphone browser 3D store with a 2D grid, and none covers older adults.
- No figures were obtained from Cockburn & McKenzie or Data Mountain.
- Not found or not researched: Wylde Flowers' inventory and collection UI (the official help page is silent, and no wiki page surfaced), flower-shop simulators beyond Garden Life, the Game UI Database, and GDC inventory talks.
- No evidence on how older adults interpret rarity colours.
- No study of long-press discoverability among older users.

---

## 3. Per-item pricing UX: many small prices without "nickel-and-diming" (running totals, anchoring, bundles, caps, rarity codes, credits vs euros, minimum basket, included foliage)

### Takeaway
The problem is not the cents themselves. Every visible per-flower price adds a decision and ties a payment to a single unit of consumption. Pain-of-paying research predicts that "running meter" feeling makes people hesitate and buy smaller.

Better structures are bundled formats where one payment covers many items:
- fixed-price bouquet sizes;
- an "included" allowance;
- a cap;
- per-flower prices shown only as swap differences.

Token currencies do raise spending by making prices less visible. EU enforcers now target exactly this: the CPC Network's March 2025 principles say prices must be shown in real money, with no forced surplus currency. French law already requires the all-in price including VAT before purchase.

Stripe's fixed €0.25 fee makes baskets under about €5 uneconomic:
- €1 basket: 26.5% of the price goes to fees;
- €5 basket: 6.5%;
- €7.14 or more keeps fees at or below 5%.

So the minimum should be framed as a "from €4.90/€5" starting bouquet, not as a minimum-order rule.

### Cited Findings
**Pain of paying, mental accounting, the taximeter effect**
- **Prelec & Loewenstein:** the closer in time payment and consumption are, the more painful the payment and the more cautious the spending. Consumption that is already paid for is enjoyed almost as if free. — [Marketing Science 17(1), 1998 (older), snippet only](https://pubsonline.informs.org/doi/10.1287/mksc.17.1.4)
- **Lambrecht & Skiera (flat-rate bias):** people often pick a flat rate even when pay-per-use would be cheaper. The bias is persistent, and its causes include the insurance and taximeter effects. — [JMR 43(2), 2006 (older), snippet only](https://www.london.edu/faculty-and-research/academic-research/p/paying-too-much-and-being-happy-about-it-existence-causes-and-con)
- **Szabo:** the mental effort of deciding whether each tiny item is worth paying for is a basic barrier to fine-grained pricing, whatever the technical cost. — ["Micropayments and Mental Transaction Costs", 1999 (older), snippet only](https://nakamotoinstitute.org/micropayments-and-mental-transaction-costs/)
- **Shirky:** only free requires no thought. — [P2P Foundation summary of Shirky 2000 (older), snippet only](https://wiki.p2pfoundation.net/Mental_Transaction_Costs)
- **Zero-price effect:** a 1¢ Hershey's vs a 14¢ Lindt drew 8% vs 30% of choices. At free vs 13¢, it became 31% vs 13%. — [Shampanier, Mazar & Ariely 2007, author PDF (older), snippet only](https://people.duke.edu/~dandan/webfiles/PapersPI/Zero%20as%20a%20Special%20Price.pdf)
- **Gourville ("pennies-a-day"):** restating a price as small daily amounts improves how the deal is judged, because people compare it with trivial expenses. — [JCR 24(4), 1998 (older), snippet only](https://ideas.repec.org/a/oup/jconrs/v24y1998i4p395-408.html)
- **Raghubir & Srivastava ("monopoly money"):** people spent more with scrip (stored-value certificates) than with cash of the same face value, and more when a credit-card logo was present. — [J. Exp. Psychology: Applied 2008 (older), snippet only](https://www.apa.org/pubs/journals/releases/xap143213.pdf)
- **Cashless effect meta-analysis:** 392 effect sizes from 71 papers. Paying without cash raises spending by a **small** amount, and the effect has **weakened over time**. — [Schomburgk, Belli & Hoffmann, Journal of Retailing 100(3), 2024](https://ideas.repec.org/a/eee/jouret/v100y2024i3p382-403.html)
- **Running totals:** a real-time spending display made **budget-constrained shoppers spend about 22% more** (and leave happier), and made **shoppers without a budget spend about 19% less**. — [van Ittersum et al., Journal of Marketing 77(6), 2013 (older); Univ. of Groningen summary, snippet only](https://www.rug.nl/feb/news/2013/130904ittersum?lang=en)
- **Premium currencies (BEUC):** 21 of the 50 most-played games of 2023 used them. BEUC argues that opaque currency prices and fixed-size bundles push spending, and filed a complaint with 22 member groups on 2024-09-12. — [BEUC press release, Sept 2024, advocacy source, snippet only](https://www.beuc.eu/press-releases/consumer-groups-denounce-video-games-manipulative-spending-tactics)
- **Per-flower unlock pricing in a bouquet app (observed):** Bloom: Flower Arrangement sold flowers and vases at $0.99 each. A 1★ review (2025-12-04) said "only 3 flowers to choose from" unless you pay per flower, and "not even worth paying $20". The next update (v1.5.2) announced "More flowers are now free to arrange — no unlock needed". — [App Store listing](https://apps.apple.com/us/app/bloom-flower-arrangement/id6744581621); [iTunes reviews RSS](https://itunes.apple.com/us/rss/customerreviews/page=1/id=6744581621/sortby=mostrecent/json)

**Partitioned and drip pricing**
- **Morwitz, Greenleaf & Johnson:** showing a base price plus a mandatory surcharge lowered the total people recalled and raised demand, compared with one all-in price. — [JMR 35(4), 1998 (older), snippet only](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1423970)
- **Abraham & Hamilton meta-analysis** (149 observations, 27 papers, N=12,878): split prices beat all-in prices when no total is shown, when surcharges are normal for the category or seen as high-benefit, and for utilitarian products. — [JMR 2018, snippet only](https://journals.sagepub.com/doi/10.1177/0022243718800724)
- **Bertini & Wathieu:** splitting the price draws attention to the secondary attributes. That helps if those attributes are valued and easy to judge, and hurts otherwise. — [Marketing Science 27(2), 2008 (older), snippet only](https://pubsonline.informs.org/doi/10.1287/mksc.1070.0295)
- **Santana, Dallas & Morwitz (drip pricing, 6 studies):** surcharges revealed late led people to choose the option that cost more in total. They stuck with it even after seeing the totals, and were **less satisfied**. — [Marketing Science 2020 (older), Columbia summary, snippet only](https://business.columbia.edu/faculty/press/consumer-reactions-drip-pricing)
- **StubHub field experiment:** showing all-in prices upfront reduced purchases and the price tier chosen. Users who were not shown fees upfront spent about 21% more and were about 14% more likely to buy. — [Blake et al., NBER WP 25186; Marketing Science 40(4) 2021 (older)](https://www.nber.org/papers/w25186); [figures via The Ticketing Business, 2021 (older), snippet only](https://www.theticketingbusiness.com/2021/02/19/drip-pricing-leads-to-consumers-spending-more-on-tickets-study/)
- **Baymard abandonment survey:** "extra costs too high" is the #1 reason for abandoning checkout (40%), and 12% "couldn't see or calculate total order cost upfront". — [Baymard, updated 2025-09-22](https://baymard.com/lists/cart-abandonment-rate)
- **French price display:** prices must be in euros including all taxes, and the total including delivery and any extra fees must be shown before an online purchase (Code de la consommation L111-1, L221-5). — [economie.gouv.fr, 2026-01-20, snippet only](https://www.economie.gouv.fr/entreprises/professionnels-quelles-sont-vos-obligations-en-matiere-daffichage-des-prix)
- **UK reference point:** drip pricing has been banned under the DMCC Act since 2025-04-06. — [CMS, 2025, snippet only](https://cms.law/en/gbr/legal-updates/the-dmcc-act-consumer-elements-come-into-force-from-6-april-2025)

**Bundles, anchors, caps, included items, minimum baskets**
- **Transaction decoupling:** when one payment covers many benefits, costs and benefits are no longer paired one-to-one, and people feel less need to "use up" each item. — [Soman & Gourville, JMR 38(1), 2001 (older), snippet only](https://inn.theorizeit.org/Details/Paper/10050?databaseId=3a0e27b9-8e00-43b0-a1c6-a3c800e66229)
- **Bundling strategy:** a synthesis with 12 propositions on which bundling strategy suits which context. — [Stremersch & Tellis, Journal of Marketing 2002 (older), snippet only](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=905129)
- **Decoys in the field (online diamond retailer):** when shoppers noticed a decoy (11–25% of the time), it raised the dominant item's sales 1.8–3.2×. Gross profit rose 14.3%. — [Wu & Cosguner, Marketing Science 39(5), 2020 (older), snippet only](https://pubsonline.informs.org/doi/10.1287/mksc.2020.1231)
- **Left-digit bias:** consumers react to a 1¢ rise from a .99 ending as if it were more than 20¢. — [Strulov-Shlain, Review of Economic Studies 90(5), 2023, snippet only](https://academic.oup.com/restud/article-abstract/90/5/2612/6931812)
- **"Free gift" framing:** an item given as a free gift is valued lower afterwards when sold on its own. — [Raghubir, J. Consumer Psychology 14, 2004 (older), snippet only](https://myscp.onlinelibrary.wiley.com/doi/abs/10.1207/s15327663jcp1401&2_20)
- **Free shipping and thresholds:** they shaped both whether people ordered and how much, but the lost fee revenue made them unprofitable for the retailer studied. — [Lewis, Singh & Fay, Marketing Science 25(1), 2006 (older), snippet only](https://ideas.repec.org/a/inm/ormksc/v25y2006i1p51-64.html)
- **Capping precedent:** TfL weekly capping on Oyster (2021-09-27). I found no behavioural evaluation of it. — [TfL press release (older), snippet only](https://tfl-newsroom.prgloo.com/news/tfl-press-release-weekly-capping-on-oyster-for-tube-and-rail-passengers-to-launch-on-monday-27-september)
- **Rarity in virtual goods:**
  - Rarity is one of the social attributes that drive virtual-item purchases. — [Lehdonvirta, Electronic Commerce Research 9, 2009 (older), snippet only](https://vili.lehdonvirta.com/virtual-item-sales-as-a-revenue-model-identifying-attributes-that-drive-purchase-decisions/)
  - Games use level-based stratification to create demand for virtual goods. — [Hamari & Lehdonvirta 2010 (older), snippet only](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1443907)
- **Physical-flower price anchors in France:**
  - A bunch of lily of the valley (muguet) costs **about €7 on average, vs €23 for Valentine's flowers**. — [Nantes Métropole, 2026-04-27](https://metropole.nantes.fr/actualites/1er-mai-le-vrai-faux-du-muguet)
  - Interflora FR's "Petits Prix" start at €19.95. — [interflora.fr](https://www.interflora.fr/)
  - Interflora mourning items run €39.95–249+. — [Interflora FR, Deuil](https://www.interflora.fr/c/deuil)

**Regulation and payment economics (France/EU, October 2026)**
- **CPC Network "Key principles on in-game virtual currencies"** (21 March 2025, non-binding):
  1. Show prices in real money.
  2. Don't obscure costs, and avoid mixing currencies or forcing exchanges.
  3. Let consumers buy the amount they need, with no forced excess.
  4. Give clear pre-contract information.
  5. Use plain terms.
  6. Respect the right of withdrawal.
  7. Design with vulnerable consumers in mind.

  Enforcement action against Star Stable ran in parallel (non-euro pricing, time pressure). — [European Commission, coordinated actions page](https://commission.europa.eu/live-work-travel-eu/consumer-rights-and-complaints/enforcement-consumer-protection/coordinated-actions/social-media-online-games-and-search-engines_en); [Linklaters TechInsights, 2025-03-27](https://techinsights.linklaters.com/post/102k6t4/game-changer-eu-introduces-consumer-protection-guidance-for-in-game-virtual-curr)
- **Digital Fairness Act:** still "announced" as of September 2026, with the proposal planned for Q4 2026. Expected scope: dark patterns, unfair pricing, addictive design and personalisation. — [European Parliament Legislative Train, updated 2026-09-20](https://www.europarl.europa.eu/legislative-train/theme-protecting-our-democracy-upholding-our-values/file-digital-fairness-act)
- **French 30-day reference-price rule (art. L112-1-1, Omnibus transposition, in force 2022-05-28):** any announced price reduction must state the lowest price charged in the previous 30 days. — [INC Omnibus table, 2022, snippet only](https://inc-conso.fr/sites/default/files/pdf/tableau-omnibus-inc-2022_0.pdf)
- **Stripe France pricing (verified 2026-10-02):**

  | Card type | Fee |
  |---|---|
  | Standard EEA cards | **1.5% + €0.25** |
  | **Premium EEA cards** | **2.8% + €0.25** |
  | UK cards | 2.5% + €0.25 |
  | International cards | 3.15% + €0.25 |

  - Currency conversion adds +2%.
  - Link is charged at the card rate.
  - 3D Secure is included.
  - Disputes cost €20.
  - — [stripe.com/fr/pricing](https://stripe.com/fr/pricing)
- **Stripe minimum charge:** €0.50. — [Stripe docs, currencies, snippet only](https://docs.stripe.com/currencies)
- **PayPal France (page updated 2026-07-15):**
  - Standard rate: **2.90% + €0.35**.
  - **Micropayment rate: 5.0% + €0.10** domestic (6.0% international). It is available on request only, and once granted it applies to **all** payments received.
  - — [paypal.com/fr business fees, verified 2026-10-02](https://www.paypal.com/fr/business/paypal-business-fees)

**Fee arithmetic (own calculation from the fees above).**

Share of each basket lost to fees, by payment method:

| Basket (incl. VAT) | Stripe standard EEA | Stripe premium EEA | PayPal standard | PayPal micropayment |
|---|---|---|---|---|
| €1 | €0.265 = **26.5%** | 27.8% | 37.9% | 15.0% |
| €2 | €0.28 = 14.0% | 15.3% | 20.4% | 10.0% |
| €3 | €0.295 = 9.8% | 11.1% | 14.6% | 8.3% |
| €5 | €0.325 = **6.5%** | 7.8% | 9.9% | 7.0% |
| €10 | €0.40 = 4.0% | 5.3% | 6.4% | 6.0% |
| €20 | €0.55 = 2.75% | 4.05% | 4.65% | 5.5% |

- **Against net revenue:** assuming the 20% standard VAT rate is included in the price (an assumption, not verified here), the Stripe standard fee is 31.8% of net revenue on a €1 basket and 7.8% on a €5 basket. — own calculation from [Stripe FR pricing](https://stripe.com/fr/pricing)
- **Smallest basket that keeps the Stripe standard fee at or below a target share** (€0.25 ÷ (target − 1.5%)), own calculation from [Stripe FR pricing](https://stripe.com/fr/pricing):

  | Target fee share | Minimum basket |
  |---|---|
  | ≤10% | €2.94 |
  | ≤6.5% | €5.00 |
  | **≤5%** | **€7.14** |
  | ≤4% | €10.00 |

- **Disputes:** one €20 dispute fee equals the Stripe fees on about 62 orders of €5. — own calculation from [Stripe FR pricing](https://stripe.com/fr/pricing)
- **PayPal micropayment rate:** it beats Stripe standard only below €4.29, and PayPal standard only below €11.90. — own calculation from [Stripe FR pricing](https://stripe.com/fr/pricing) and [PayPal FR fees](https://www.paypal.com/fr/business/paypal-business-fees)

### Inferences
- **Sell containers, not meters.**
  - Lead with fixed-price bouquet sizes, for example "Petit €4.90 · Moyen €9.90 · Généreux €14.90". Each size includes N focal flowers chosen from common and rare ones, plus foliage, filler and a card. The music and vase options are separate.
  - Per-flower prices then appear **only as swap differences**: "Pivoine à la place de la rose: +€0.40".
  - This is transaction decoupling plus a three-tier menu. The middle tier works as the anchor, and the larger tier as a decoy only if it is genuinely good value.
- **Never show 1–5 cent prices.** They add a decision without the pull of "free".
  - Mark common flowers "inclus" within the bouquet's allowance.
  - Price only rare and precious flowers, in steps of €0.10–0.50.
  - Optionally cap the flower spend: "jamais plus de €X de fleurs par bouquet".
- **Running total as progress against a chosen budget**, for example "€7.40 sur votre bouquet à €9.90". Avoid an open-ended counter.
  - The smart-cart study suggests a running total raises spending for budget-minded shoppers and lowers it for others. Many 50–75-year-old Facebook users are likely budget-minded, but that is my assumption.
  - The total shown must always be all-in and include VAT. Mandatory "frais de service" must never be added later.
- **Add-ons:** price message, music and vase separately, because they are high-benefit extras (Bertini & Wathieu; Abraham & Hamilton). The total updates instantly on the same screen.
  - A threshold reward ("musique offerte dès €12") can lift baskets above the fee-efficient level. Model what the free add-on costs first, following Lewis et al.
- **Foliage and filler** are "inclus", never "offert/gratuit". Selling them later would undercut their value, per the free-gift finding (Raghubir).
- **Rarity tiers are deterministic and visible:** a label, an icon and a euro price.
  - No random paid outcomes.
  - No countdowns or fake scarcity on "légendaires" (CPC principles; Star Stable case).
  - "Surprise me" must be free and only *propose* a bouquet that the user can inspect before paying.
- **Credits:** the only legitimate gain is pooling fees, since a €10 top-up costs 4.0% vs 6.5% for each of two €5 orders. Any credit system must show euro prices, allow exact top-ups and avoid leftover-forcing packs. E-money and stored-value rules were not researched. **Don't launch with credits.**
- **Minimum basket:** a starting bouquet of about €4.90–5 keeps the Stripe fee around 6.5%. Single-flower "€1 sends" lose about 26% of the price to fees and should not exist as separate payments.
- **Premium cards:** premium EEA cards cost 2.8% + €0.25 and may be over-represented among affluent older French cardholders. That is an unverified assumption; check the card mix in Stripe reporting after launch.
- **Price anchor in marketing:** "le prix d'un brin de muguet" (about €7) or "trois fois moins qu'un bouquet livré" (Valentine's average about €23; Interflora "Petits Prix" from €19.95). Use only verifiable reference prices, and apply the 30-day rule to any "was €X" claim.

### Gaps
- No study of cent-level per-item prices inside a "compose your own" configurator.
- No study of whether age changes the pain of paying.
- Not retrieved: Abraham & Hamilton's pooled effect sizes, and whether the *number* of price components (the core nickel-and-diming question) was tested.
- I found no behavioural evaluation of spend caps outside transit.
- No 2018–2026 controlled experiment on how the currency denomination (credits vs euros) affects spending.
- The official CPC principles PDF and the DFA text were not read; no DFA text exists yet.
- Not researched: e-money and limited-network rules for stored credit, and VAT/OSS treatment of e-services sold to consumers.
- The share of premium cards among French customers is unknown.

---

## 4. Occasion-led onboarding and suggestions: "who / occasion / mood" quizzes, auto-generated bouquets with "regenerate / surprise me", acceptance of recommendations, how many choices to show

### Takeaway
**Occasion first.** Make occasion the first screen: a few large tiles that each open a ready, *recommended* bouquet. Keep any further questions (recipient, mood, favourite colour) short, skippable and linear. NN/g says wizards suit novices and infrequent tasks, and Baymard finds occasion ("thematic") filters are heavily used when present (snippet-level).

**Defaults.** Defaults and recommendations are powerful. The default-effect meta-analysis finds d=0.68, strongest when the default reads as an endorsement.

**Choice overload.** Choice overload is conditional, but all four of its moderators apply to this product: uncertain preferences, hard-to-compare options, a quick-gift goal, and time pressure on the day. So show one hero suggestion plus 2–3 clearly different alternatives, and offer "Une autre proposition" with history and undo.

**Condolences.** Condolences need a separate, sober path. Interflora FR handles mourning in its own section, with ceremony-timed delivery and a white/pastel palette.

**French calendar and etiquette.** French flower rules shape the presets. For example, chrysanthemums mean mourning, and lily of the valley (*muguet*) belongs to 1 May.

### Cited Findings
**Quizzes, guided selling, occasion entry**
- **NN/g on wizards:** wizards suit novice, infrequent, linear tasks such as an occasion quiz, but not creative work. Details in §1. — [NN/g, Budiu, 2017-06-25 (older)](https://www.nngroup.com/articles/wizards/)
- **Baymard on gifting:** let users mark an order as a gift, show gift information early, and word fields from the recipient's side ("Gift Recipient's Address"). — [Baymard "Gifting UX", 2020-12-15, updated 2025-11-20](https://baymard.com/blog/gifting-flow)
- **Baymard on thematic search and filters:**
  - 20% of top sites lack thematic filters, and 60% don't support thematic queries.
  - When thematic filters were offered, test users used them heavily (above 50%).
  - Their absence led to abandonment, because users assumed the site lacked suitable items.
  - — [Baymard, Macy's filtering, snippet only](https://baymard.com/blog/macys-filtering-experience); [Baymard, search query types, snippet only](https://baymard.com/blog/ecommerce-search-query-types)
- **Octane AI quiz benchmarks:**
  - Quiz completion averages about 60%, and quiz conversion about 12% (range 7–25%).
  - Quiz takers have about 50% higher average order value.
  - In the Geologie case, conversion went from 9% to 13% with completion above 90%.
  - — [Octane AI customers, vendor claim, snippet only](https://octaneai.com/customers); [Octane AI Geologie case, vendor claim, snippet only](https://www.octaneai.com/case-studies/geologie)
- **Interflora FR mourning ("Deuil") section:**
  - A separate section organised by product form, from bouquets to wreaths and grave plants.
  - Delivery to home, funeral home, crematorium or grave, with "Respect de l'heure de la cérémonie" (ceremony time respected).
  - Mostly white and pastel colours, ribbon messages, etiquette guides and a dedicated phone line.
  - Prices €39.95–249+.
  - — [interflora.fr/c/deuil, accessed 2026-10-02](https://www.interflora.fr/c/deuil)
- **Other florists' sympathy sections:**
  - 1-800-Flowers runs a separate Sympathy section with "Specialty Sympathy Advisors". — [1-800-Flowers, snippet only](https://1800flowers.com/Sympathy)
  - Aquarelle has a separate funeral section. — [Aquarelle, snippet only](https://www.aquarelle.com/special-occasions/funeral)
- **Competitor patterns (observed):**
  - Attached asks "For romantic partner / family / a friend / a co-worker" on the message step and lists 25 occasion landing pages. — [attachedapp.com](https://www.attachedapp.com/digital-bouquet)
  - theBouquet offers 12 numbered "Templates", only 1 of them free. — [thebouquet.me/create](https://thebouquet.me/create)
  - onlinebouquet.com shows 6 featured ready-made bouquets to customise. — [onlinebouquet.com](https://onlinebouquet.com/)
- **Gift psychology:**
  - **Gino & Flynn 2011:** recipients appreciate requested gifts more than unrequested ones and see them as more thoughtful. — [Stanford GSB, 2011 (older), snippet only](https://www.gsb.stanford.edu/news/research/flynn_giving_2011.html)
  - **Galak, Givi & Williams 2016:** givers optimise for the moment of exchange, while recipients care about value over the time they own the gift. — [PsyPost summary, 2016 (older), snippet only](https://www.psypost.org/research-explains-presents-great-give-not-receive)
  - **Steffel & LeBoeuf 2014:** givers over-individuate gifts for multiple recipients, passing up the gift each would like best. — [WUSTL record (older), snippet only](https://profiles.wustl.edu/en/publications/overindividuation-in-gift-giving-shopping-for-multiple-recipients/)
  - **Atasoy & Morewedge 2018:** digital goods are valued less than physical ones because of weaker psychological ownership. — [JCR 44(6) (older), snippet only](https://ideas.repec.org/a/oup/jconrs/v44y2018i6p1343-1357..html)
- **Survey on physical vs digital gifts:** 65% of respondents prefer to give a physical gift. 32% of Gen Z vs 7% of Boomers prefer giving digital cash. — [Wells Fargo survey via BusinessWire, 2025-12-09, vendor claim, snippet only](https://secure.businesswire.com/news/home/20251209399541/en/Holiday-Gifting-Going-Digital-Wells-Fargo-Study-Reveals-Growing-Trend)
- **Why French people hesitate to buy online:** the top reason is not being able to see or touch the product (30%). — [Arcep/Crédoc Baromètre du numérique, édition 2026 (fieldwork June 2025)](https://www.arcep.fr/uploads/tx_gspublication/barometre-du-numerique-edition-2026_INFOGRAPHIE.pdf)

**Suggestions, regenerate and the number of choices**
- **Defaults meta-analysis** (Jachimowicz et al. 2019): 58 studies, N=73,675, **d=0.68** (95% CI 0.53–0.83). Defaults work better in consumer domains, and when they signal **endorsement** or status quo (endowment). A few studies found null or negative effects. — [Behavioural Public Policy 3(2), 2019 (older), IDEAS abstract](https://ideas.repec.org/a/cup/bpubpo/v3y2019i02p159-186_00.html)
- **Netflix:** recommendations drive about 80% of hours streamed. — [Gomez-Uribe & Hunt, ACM TMIS 2015 (older), snippet only](https://gwern.net/doc/reinforcement-learning/exploration/2015-gomezuribe.pdf)
- **Scheibehenne, Greifeneder & Todd 2010:** 63 conditions, N=5,036. The mean choice-overload effect is about zero, with large differences between studies. — [Mannheim repository (older), snippet only](https://madoc.bib.uni-mannheim.de/30861/)
- **Chernev, Böckenholt & Goodman 2015:** overload reliably rises with task difficulty, choice-set complexity, preference uncertainty, and an effort-minimising goal. Once these moderators are accounted for, assortment size has a significant effect. — [J. Consumer Psychology 25(2) (older), snippet only](https://www.kellogg.northwestern.edu/faculty/research/detail/2015/when-product-assortment-leads-to-choice-overload-a-conceptual)
- **Jam study (Iyengar & Lepper 2000):** 60% of passers-by stopped at the 24-jam display vs 40% at the 6-jam one, but purchases were more likely with 6. — [AcaWiki summary (older), snippet only](https://acawiki.org/When_Choice_is_Demotivating:_Can_One_Desire_Too_Much_of_a_Good_Thing%3F)
- **Regenerate in existing tools (observed):** DigiBouquet's arrangement step has two regenerate-style buttons, "Try a new Arrangement" (reshuffle) and "Change Greenery", with no manual drag. — [digibouquet.vercel.app](https://digibouquet.vercel.app/bouquet?mode=color)
- **NN/g on generative UI:** interfaces generated per user, under designer constraints ("must / should / never show"). Risks are inconsistency, relearning and bias. — [NN/g, Moran & Gibbons, 2024-03-22](https://www.nngroup.com/articles/generative-ui/)
- **NN/g on prompt controls:** these include follow-ups such as "regenerate". — [NN/g, snippet only](https://www.nngroup.com/articles/prompt-controls-genai/)
- **French attitudes to algorithms and AI:**
  - 72% of social-network users would prefer *non-personalised* content.
  - Daily use of generative AI is 17% among people over 60, vs 51% among 18–24s.
  - — [Arcep/Crédoc, édition 2026](https://www.arcep.fr/uploads/tx_gspublication/barometre-du-numerique-edition-2026_INFOGRAPHIE.pdf)

**French occasion calendar and flower etiquette (for presets and scheduling)**
- **Fête des mères:** set by law 50-577 of 24 May 1950 on the last Sunday of May, moved to the first Sunday of June if it coincides with Pentecost (as in 2023). — [Europe 1, 2023-06-02, updated 2024-11-17](https://www.europe1.fr/societe/loi-de-1950-pentecote-pourquoi-la-fete-des-meres-est-elle-celebree-en-juin-cette-annee-4186609)
- **Fête des grands-mères:** the first Sunday of March (1 March 2026, 7 March 2027). La Poste offers 4 message templates for it. — [laposte.fr](https://www.laposte.fr/modeles-lettres/fetes-des-grands-meres)
- **Fête des grands-mères origin:** a 1987 commercial creation of the Café Grand'Mère brand, not official. — [Europe 1, snippet only](https://www.europe1.fr/societe/fete-des-grands-meres-depuis-quand-celebre-t-on-les-mamies-en-france-4233757)
- **Muguet du 1er mai:**
  - The tradition took off in the early 1900s; the Charles IX origin story is "probablement faux".
  - Street sales are only 7% of sales.
  - An average muguet bunch costs about €7, vs €23 for Valentine's flowers.
  - — [Nantes Métropole, 2026-04-27](https://metropole.nantes.fr/actualites/1er-mai-le-vrai-faux-du-muguet)
- **Mourning flowers in France:**
  - Chrysanthemums are funeral flowers in France (Toussaint, graves), although they signify other things elsewhere.
  - White is used for children, red for a spouse, and pastels for commemorations.
  - — [Advitam, "Flowers for mourning", 2026](https://en--meb-prod.advitam.fr/howto-funeral/funeral-legal-framework/flowers-mourning-meanings)
  - Offering chrysanthemums as a personal gift is a cultural misstep in France. — [italki blog, snippet only](https://www.italki.com/en/blog/french-flowers)
- **Odd numbers:** French folk etiquette says bouquets under about 10–12 stems should have an odd number of flowers. — [buzzwebzine, low-authority, snippet only](https://www.buzzwebzine.fr/langage-fleurs-signification-couleurs-varietes-nombre/)

### Inferences
- **First screen:**
  - 6–8 large occasion tiles: Anniversaire, Fête des mères/grands-mères (seasonal), Amour/Saint-Valentin, Merci, Rétablissement, Naissance, Condoléances, and "Juste comme ça".
  - Each opens a recommended bouquet labelled "Notre suggestion pour…". That label is the endorsement default.
  - An optional 2–3-question refinement (pour qui? ses couleurs préférées? humeur?) with a progress bar and "Passer".
  - Asking the recipient's favourite colour approximates a "requested gift" (Gino & Flynn) and feeds the colour facet (§2).
- **Suggestions per screen:**
  - 1 hero bouquet plus 2–3 alternatives that differ on **one** visible axis: palette/mood, or size/price (€4.90 / €9.90 / €14.90).
  - At most about 6 per occasion before "Voir d'autres bouquets".
  - **"Une autre proposition"** swaps the hero in place, keeps a "précédente" back arrow and history, and never discards the user's edits without confirmation.
  - Constrain regeneration with per-occasion rules for palette, flower families and price band, not open randomness.
  - Use plain words, not AI jargon, given older users' low AI use.
- **Explain suggestions in human terms** ("Roses roses et pivoines : tendresse, idéal pour une maman"), not "personnalisé par algorithme", given French scepticism of personalisation.
- **Condolences mode:**
  - No "surprise me", confetti, playful sway, upsell or rarity badges.
  - White and pastel palette with ≥4.5:1 text contrast.
  - Sober message templates.
  - Option to schedule for the ceremony day and time.
  - Allow chrysanthemums *only* here.
- **Cultural guardrails in the auto-composer:**
  - Odd numbers of focal flowers in small bouquets (folk etiquette, weak source).
  - No chrysanthemums outside mourning.
  - A 1 May "brin de muguet" micro-bouquet as a seasonal hit. It must still be priced at ≥ about €4.90 or bundled with several recipients because of fees (§3).
- **Multiple recipients:** make "Envoyer le même bouquet à une autre personne" one tap, for example Mother's Day for a mother and a mother-in-law (Steffel & LeBoeuf).
- **Instrument:** acceptance of the first suggestion, regenerations per sent bouquet, edit depth, and quiz completion → bouquet sent. Many regenerations mean the defaults need work. Quiz benchmarks are vendor-only.

### Gaps
- Baymard's dedicated gift-finder and guided-selling research was not retrieved; the thematic-filter figures are snippet-level.
- No NN/g study specifically on "regenerate" buttons or on 3–5-variation grids.
- No independent (non-vendor) quiz completion or conversion benchmarks.
- The often-quoted "35% of Amazon revenue comes from recommendations" (attributed to McKinsey, 2013) has no primary source; do not use it.
- No peer-reviewed 2020–2026 study on how animated digital flowers or e-cards are appreciated.
- No choice-overload evidence specific to older adults or small screens.
- Odd-number etiquette rests on low-authority sources; check with a French florist.

---

## 5. Senior-friendly mobile UX (tap targets, text size, contrast, gestures to avoid, linear flows, trust) and checkout/payment preferences in France

### Takeaway
**Who the older users are.** Older adults are slower and make more errors. Small, light text, small targets, dropdowns, sliders and hidden gestures hurt them most. In France, **60% of 60–74-year-olds and 88% of people 75+ have no or only weak digital skills** (INSEE, 2023 data).

**Interface baseline.**
- WCAG 2.2 AA at minimum: 4.5:1 text contrast and text that still works when enlarged to 200%.
- A single-pointer alternative to every drag (SC 2.5.7).
- Touch targets at the platform sizes: Apple 44×44 pt, Material 48×48 dp (about 9 mm), not WCAG's 24 px floor.
- One decision per screen, with a persistent Back button and autosave.

**Checkout.**
- Guest checkout only; Baymard finds that forced account creation and extra costs drive abandonment.
- Card first: the card carries 53% of French online payments, and e-wallets 27% (PayPal about 18%).
- Wallet buttons only when available.
- Visible proof of who the company is, plus a reachable human.
- Two legal steps:
  - an explicit consent checkbox for immediate supply of digital content, which waives the 14-day withdrawal right;
  - e-commerce accessibility duties under the European Accessibility Act, in force since 28 June 2025 (micro-enterprises exempt).

### Cited Findings
**Older adults and mobile UX**
- **NN/g, "Usability for Older Adults" (Kane):**
  - Research rounds in 2001, 2013 and 2018–19, with 123 participants aged 65–89 in 5 countries.
  - Declining vision and dexterity lead to small-target errors and typing errors. On mobile, text was often too small and too light.
  - Recommendations: larger fonts and targets, high contrast, clear error messages, flexible input formats.
  - Website-use ability declines about 0.8% a year between ages 25 and 60.
  - — [NN/g, 2019-09-08 (older)](https://www.nngroup.com/articles/usability-for-senior-citizens/)
- **NN/g report "UX Design for Seniors", 3rd edition:** 87 guidelines from 123 seniors in 6 countries. It flags dropdowns and sliders as hard to use on touch screens. — [NN/g report page](https://www.nngroup.com/reports/senior-citizens-on-the-web/)
- **NN/g, 2013:** users aged 65+ were 43% slower than users aged 21–55. — [NN/g, 2013-05-28 (older), snippet only](https://www.nngroup.com/articles/usability-seniors-improvements/)
- **Apple HIG Accessibility** (change log 2025-06-09):
  - iOS **default control size 44×44 pt** (minimum 28×28 pt).
  - About 12 pt of padding around bezelled elements and about 24 pt around elements without a bezel.
  - Support text enlargement of at least **200%**.
  - iOS default text size 17 pt (minimum 11 pt).
  - Contrast follows WCAG AA: 4.5:1 for text up to 17 pt.
  - "Offer alternatives to gestures": for example, a swipe-to-delete also needs a button.
  - Use the simplest gestures for frequent actions.
  - — [Apple HIG, Accessibility, read 2026-10-02](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- **Material Design 3:**
  - Touch targets **at least 48×48 dp**, about 9 mm physical; 7–10 mm is recommended.
  - Larger targets may suit a wider range of users.
  - — [Material Design 3, Accessibility designing / structure, read 2026-10-02](https://m3.material.io/foundations/designing/structure)
- **WCAG 2.2 success criteria:**
  - **1.4.3 Contrast (AA):** 4.5:1 for normal text, 3:1 for large text.
  - **1.4.4 Resize text (AA):** text can be enlarged to 200%.
  - **1.4.12 Text spacing (AA):** no loss of content or function at line height 1.5× and paragraph spacing 2×.
  - **2.5.1 Pointer gestures (A):** anything done with a multipoint or path-based gesture must also work with a single pointer.
  - — [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- **WCAG 2.5.7 Dragging Movements (AA):**
  - "All functionality that uses a dragging movement for operation can be achieved by a single pointer without dragging", unless essential.
  - Examples: tap-to-select plus move buttons for sortable lists, and menus instead of drag-and-drop.
  - — [W3C Understanding 2.5.7, updated 2026-08-10](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
- **WCAG 2.5.8 Target Size Minimum (AA):**
  - Targets must be at least 24×24 CSS px, unless enough spacing or an exception applies.
  - W3C advises aiming for 44×44 (SC 2.5.5, AAA) on important controls.
  - — [W3C Understanding 2.5.8, updated 2026-05-11](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- **Systematic reviews:**
  - A 2023 review (JMIR mHealth, literature 2010–2021) found 28 guidelines; "simplify" and "increase size and spacing of interactive controls" matter most. — [PMC10557006, 2023, snippet only](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10557006/)
  - A 2025 review stresses simple navigation, larger text and targets, and error-tolerant interfaces. — [PMC12350549, 2025, snippet only](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12350549/)
- **INSEE digital skills, published 2025-10-14 (2023 survey):**

  | Group | No digital skills | Weak digital skills |
  |---|---|---|
  | All | 15.7% | 30.3% |
  | 40–59 | 6.7% | 33.7% |
  | 60–74 | 23.4% | 36.7% |
  | 75+ | 62.2% | 26.0% |

  — [INSEE](https://www.insee.fr/fr/statistiques/8616801)
- **Arcep/Crédoc Baromètre du numérique, 2026 edition** (n=4,145, fieldwork June 2025):
  - Only 8% of people 70+ and 11% of retirees feel competent across all digital domains, versus 29% of all users. This is my reading of the infographic, where the label is ambiguous.
  - Nearly 6 in 10 French people help relatives with digital tasks.
  - When stuck, people prefer human contact.
  - — [Arcep, édition 2026 infographic](https://www.arcep.fr/uploads/tx_gspublication/barometre-du-numerique-edition-2026_INFOGRAPHIE.pdf)

**Social and messaging reach (where the 50–75 audience is)**
- **Messaging use (Arcep 2026):**
  - 86% of French people use instant messaging (64% daily).
  - Among messaging users: **WhatsApp 87%, Messenger 76%**, Instagram 60%.
  - 66% chose their messaging apps because their contacts use them.
  - — [Arcep, édition 2026](https://www.arcep.fr/uploads/tx_gspublication/barometre-du-numerique-edition-2026_INFOGRAPHIE.pdf)
- **Facebook in France:** about 48.2M users; ages 55–64 are about 12% and 65+ about 12.2% of them (Meta ad-audience data). — [NapoleonCat, 2026, snippet only](https://stats.napoleoncat.com/facebook-users-in-france/2026/03/)
- **Smartphones (Arcep/Crédoc 2025 edition):** 22% of phones were bought used or refurbished, and 27% of people kept their phone 3+ years. Expect older handsets. — [Arcep, 2025-03-19](https://www.arcep.fr/cartes-et-donnees/nos-publications-chiffrees/barometre-du-numerique/le-barometre-du-numerique-edition-2025.html)

**Checkout and payments**
- **Baymard cart abandonment** (page updated 2025-09-22): average abandonment is 70.22% across 50 studies.

  | Reason for abandoning checkout | Share |
  |---|---|
  | Extra costs | 40% |
  | Didn't trust the site with card details | 19% |
  | Forced account creation | 18% |
  | Too long or complicated | 17% |
  | Couldn't see the total upfront | 12% |
  | Not enough payment methods | 9% |

  - The average checkout has 23.48 form elements against an ideal of 12–14 (7–8 fields).
  - — [Baymard](https://baymard.com/lists/cart-abandonment-rate)
- **Baymard on guest checkout:**
  - 47% of sites fail to make guest checkout the most prominent option.
  - 24% of US shoppers abandoned because they were forced to create an account (n=4,384, 2022).
  - Make "Guest checkout" a visible button at the top of the first mobile screen, and offer account creation at the confirmation step.
  - — [Baymard, 2023-01-17](https://baymard.com/research-articles/make-guest-checkout-prominent)
- **Banque de France Bulletin 256/1** (ECB SPACE 2024 survey):
  - 25% of all payments in France were made online in 2024.
  - Online payments by method: **card 53%**; e-wallets and online payment solutions **27%** (+6 points), of which **PayPal about 18%**.
  - In shops, mobile payment was only 4% of transactions.
  - 62% say they prefer the card.
  - People aged 40+ are more likely to use cash than 18–39-year-olds.
  - — [Banque de France, February 2025](https://www.banque-france.fr/system/files/2025-02/BDF256-1_Habitudes_paiement_web.pdf)
- **Mobile payment growth:** mobile payments reached 15% of card transactions in 2024 (11% in 2023). — [Banque de France, 2025-12-16, snippet only](https://www.banque-france.fr/fr/publications-et-statistiques/publications/en-2024-les-francais-ont-continue-dadopter-des-usages-innovants-dans-leurs-paiements)
- **Payment habits by age:** 77% of people over 65 mainly use the card, vs 43% of 18–24-year-olds; 22% of young people favour mobile payment vs 4% of seniors. — [Journal de l'économie, 2025, source attribution uncertain, snippet only](https://www.journaldeleconomie.fr/?p=39292)
- **Hesitation to buy online (Arcep 2026):**
  - "Payment security not assured": 12%, down from 36% in 2016.
  - "Don't know the company behind the site": 10%.
  - "Lack of seller information": 6%.
  - 74% bought online in the past 12 months.
  - — [Arcep, édition 2026](https://www.arcep.fr/uploads/tx_gspublication/barometre-du-numerique-edition-2026_INFOGRAPHIE.pdf)
- **Strong customer authentication, low-value exemption (PSD2 RTS Art. 16):**
  - Payment providers *may* skip strong authentication for remote payments **≤ €30**.
  - Only while the cumulative amount since the last strong authentication stays ≤ €100, or there have been no more than 5 consecutive exempted payments.
  - — [Commission Delegated Regulation (EU) 2018/389, Art. 16 (text via legislation.gov.uk)](https://www.legislation.gov.uk/eur/2018/389/chapter/III)
  - 3D Secure is included in Stripe's standard pricing. — [stripe.com/fr/pricing](https://stripe.com/fr/pricing)
- **Wallets in in-app browsers:** Stripe documents Link, PayPal, Klarna and Amazon Pay as **not supported** in in-app webviews. Apple Pay is supported in iOS webviews subject to eligibility. Google Pay requires the host app to enable the Payment Request API. See §6. — [Stripe Docs, Express Checkout Element](https://docs.stripe.com/elements/express-checkout-element)
- **Right of withdrawal for digital content:** online digital content falls outside the 14-day cooling-off period only if the consumer **expressly agreed** to lose the right and performance (download or streaming) has started. — [Your Europe (European Commission), last checked 2026-04-28](https://europa.eu/youreurope/citizens/consumers/shopping/returns/index_en.htm)
  - In France (Code de la consommation L221-28 13°), this agreement cannot be inferred from general terms and conditions or from payment alone. — [legalplace.fr guide, snippet only](https://www.legalplace.fr/guides/renoncement-expres-droit-retractation)
- **European Accessibility Act:**
  - Since **28 June 2025**, e-commerce services must meet new accessibility requirements, with the DGCCRF as one of the enforcement authorities.
  - Exemption: **businesses with fewer than 10 employees and under €2M annual turnover**, or cases of disproportionate burden.
  - — [DGCCRF fiche, 2025-07-01, read in browser 2026-10-02](https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/la-nouvelle-directive-europeenne-accessibilite-pour-des-produits-et-des-services-accessibles-aux-personnes-en-situation)

### Inferences
- **Type:** body text 17–18 CSS px (iOS default 17 pt), line height about 1.5, minimum 4.5:1 contrast. Test at 200% text size inside the Facebook and Messenger webviews.
  - Pastel and white condolence screens are where contrast will fail. Use dark text on light, never light grey on white.
- **Targets:** 48×48 px for flower tiles, swap/remove buttons and the primary call to action, with ≥8–12 px gaps. Treat WCAG's 24 px as a legal floor, not a goal.
- **Gestures:**
  - No drag-only composition (SC 2.5.7).
  - No pinch or rotate (SC 2.5.1).
  - No long-press-only variants.
  - No swipe-only shelves: add arrow buttons and "Tout voir".
  - Undo is always visible.
- **Flow:**
  - One decision per screen, with named steps ("1 Bouquet · 2 Message · 3 Envoi").
  - A persistent "Retour".
  - Autosave on the server and no session timeouts.
  - Errors written in plain French, inline, keeping what the user typed.
- **Help for 50–75s:**
  - A visible human channel ("Une question ? Appelez/écrivez-nous", WhatsApp is the natural fit).
  - A "Faire avec un proche" option that sends a link to a helper. About 6 in 10 French people already help relatives.
- **Checkout:**
  - Guest only, about 5–7 fields: sender first name, email for the receipt, recipient first name, optional recipient email or phone for scheduled sends, message.
  - Card form first with CB/Visa/Mastercard marks. Show Apple Pay or Google Pay buttons only when Stripe reports them as available.
  - PayPal only outside in-app browsers.
  - Offer an account *after* payment ("Retrouvez vos bouquets" through a magic link).
- **Withdrawal checkbox:** add an unticked checkbox near "Payer": "Je demande l'accès immédiat à mon bouquet numérique et je reconnais perdre mon droit de rétractation". Confirm it in the receipt email (the durable medium). This is legally needed and also reassures buyers.
- **Trust block on the bouquet and checkout screens:** company name, SIREN, a French address, mentions légales, secure-payment cues, real reviews, and the reachable contact. This answers the "unknown company" and "payment security" hesitations.
- **3-D Secure:** at €5–20 the issuer may apply the ≤€30 exemption, but expect bank-app challenges anyway. Show "Validez dans votre application bancaire" with a spinner, then resume automatically, and never lose the bouquet if the user switches apps.
- **EAA:** even if exempt as a micro-enterprise at launch, build to WCAG 2.2 AA (EN 301 549 basis) now. Retrofitting after growth is costlier, and the audience needs it.

### Gaps
- No 2020–2026 NN/g article or Jakob Nielsen (UX Tigers) piece on ageing was retrieved, and the NN/g senior research is from 2019.
- No peer-reviewed millimetre target sizes for older adults were captured; Jin et al. 2007 was seen as a snippet only.
- Payment preferences by age come from a source with uncertain attribution. ECB SPACE age tables and FEVAD age splits were not read.
- No French data on 3-D Secure challenge or failure rates for low-value payments, or on how often issuers grant the ≤€30 exemption.
- No data on how older adults behave inside the Facebook or Messenger in-app browsers.
- The French L221-28 13° text was not read on Légifrance; the EU-level condition is verified via Your Europe.
- No data on the share of French 50–75-year-olds who use Facebook; only their share of Facebook's audience was found.

---

## 6. Gift-sending flow: message, recipient preview, sharing (WhatsApp/Messenger/SMS), scheduling, in-app browser limits, recipient→sender loop, "save this bouquet"

### Takeaway
The flow e-card leaders use, and the one this audience expects, has six parts:
1. Compose a message from occasion templates (an AI "help me write" is optional).
2. See a full-screen preview of exactly what the recipient will see.
3. Pay.
4. Share through a large WhatsApp button, SMS or copy-link, or schedule a send.
5. Get an "opened" notification.
6. Receive a reply.

In-app browsers are the main technical risk:
- **Card form as baseline:** Stripe documents Link and PayPal as unsupported in in-app webviews, and Google Pay works in Android WebView only if the host app opted in. Apple Pay is documented as supported in iOS webviews, but WebKit disables payment APIs when the host app injects scripts, which Meta's browsers did in 2022. Card entry must always be the baseline, and every wallet must be tested on real devices.
- **No autoplayed sound:** sound needs a user tap, so the reveal should open with a "touch to open" gesture.
- **Server-side state:** state does not follow users from the in-app browser to Safari or Chrome, so drafts and gardens must live on the server.

The recipient page is the growth engine:
- a "send one back" button;
- a "Créé avec…" credit;
- a "keep this bouquet" email link that builds a personal vase or garden.

There are no published recipient→sender conversion benchmarks, so this loop has to be instrumented.

### Cited Findings
**Message composition, preview, scheduling**
- **Baymard gifting benchmark:**
  - 46% of benchmarked sites don't allow gift orders.
  - 80% show no gifting options on product pages.
  - 42% can't mark an item as a gift in the cart.
  - 0% adapt shipping labels for gifts.
  - Some users abandon rather than go through a non-gift checkout.
  - — [Baymard, "Gifting UX", published 2020-12-15, updated 2025-11-20](https://baymard.com/blog/gifting-flow)
- In Baymard checkout testing, 53% of users sending a gift added a gift message, and sites should say where the message will appear. — [Baymard research article, snippet only](https://baymard.com/research-articles/gifting-flow)
- **Jacquie Lawson** (animated e-cards for an older audience):
  - Sends can be scheduled up to 1 year ahead, by email only.
  - Scheduled cards go out early morning in the sender's country.
  - "Cards Pending" lets senders edit or cancel.
  - "Card History" shows whether a card was viewed.
  - Recipients can reply.
  - — [Jacquie Lawson FAQ, snippet only (HTTP 403)](https://www.jacquielawson.com/faq/3475); [Card History FAQ, snippet only](https://www.jacquielawson.com/faq/3496)
- **Punchbowl:** a "Send Later" date and time, cancel or reschedule before sending, and a dashboard showing who viewed. — [Punchbowl Help, snippet only](https://help.punchbowl.com/article/185-can-i-schedule-a-digital-card-to-be-sent-at-a-future-date)
- **Amazon eGift:** scheduling up to 1 year ahead, but delivery runs 12 a.m.–6 p.m. Pacific time, not in the recipient's local time. — [Amazon Help, snippet only](https://digprjsurvey.amazon.com/csad/help/node/GNMZF6AH6A39HP9M)
- **Moonpig "Smart Text"** (December 2023) suggests card messages with generative AI. — [Retail Technology Innovation Hub, 2023-12-11, snippet only](https://retailtechinnovationhub.com/home/2023/12/11/online-retailer-moonpig-helps-shoppers-write-their-christmas-cards-with-new-smart-text-ai-tool)
- **French precedent for message templates:** La Poste publishes 4 ready-to-use "Fête des grands-mères" message templates of about 50–100 words. The tone is affectionate and the themes include distance ("même si je ne peux pas être à tes côtés"). The page notes the date rule, the first Sunday of March (1 March 2026, 7 March 2027). — [laposte.fr, modèles de lettres](https://www.laposte.fr/modeles-lettres/fetes-des-grands-meres)
- **Competitor composers** (direct observation, 2026-10-02):
  - **theBouquet:** a message is required, from 10 to 500 characters ("unlock up to 10,000"). Voice messages and email delivery are paid. The card-style step previews the sender's own text in 10 styles.
  - **Attached:** a relationship selector (partner, family, friend, co-worker), To/From fields of up to 120 characters, and a message of up to 2,000 characters.
  - **DigiBouquet:** a fixed "Dear … / Sincerely …" card template.
  - — [thebouquet.me/create](https://thebouquet.me/create); [attachedapp.com editor](https://www.attachedapp.com/send-virtual-flowers/edit); [digibouquet.vercel.app](https://digibouquet.vercel.app/bouquet?mode=color)

**Sharing mechanics**
- **WhatsApp (official):** `https://wa.me/<number>?text=<urlencoded>` pre-fills a message. **`https://wa.me/?text=<urlencoded>` (no number) opens the user's contact picker** with the text pre-filled. — [WhatsApp Help Center "Comment utiliser les liens clic vers WhatsApp", read in browser 2026-10-02](https://faq.whatsapp.com/5913398998672934)
- **Messenger Send Dialog** (web) is officially "not supported on mobile devices". It needs an `app_id` and is meant for person-to-person sharing. — [Meta for Developers, Send Dialog](https://developers.facebook.com/docs/sharing/reference/send-dialog)
- Meta discontinued its Messenger desktop apps on 2025-12-15. — [Storyboard18, snippet only](https://www.storyboard18.com/digital/meta-to-discontinue-messenger-desktop-apps-for-mac-and-windows-82710.htm)
- **SMS links:** Android uses `sms:?body=`, iOS 8+ uses `sms:&body=`, and the body must be URL-encoded. — [Rick Strahl, 2013 (older), snippet only](https://weblog.west-wind.com/posts/2013/Oct/09/Prefilling-an-SMS-on-Mobile-Devices-with-the-sms-Uri-Scheme)
- **Web Share API:** requires HTTPS and a user gesture. Use `navigator.canShare()` to check support first. MDN still lists it as "Limited availability". — [MDN, modified 2026-07-16](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
  - About 92.8% of global usage (89.7% full support). — [caniuse, 2026-03-05](https://caniuse.com/web-share)
  - Reported missing (`navigator.share` undefined) in Android WebView. — [B4X forum, snippet only](https://www.b4x.com/android/forum/threads/web-share-api-not-support-in-webview.149006/?amp=1)
- **Link previews:**
  - **Facebook:** 1200×630 recommended, 600×315 minimum for the large card, 1.91:1 ratio, ≤8 MB. Add `og:image:width/height` so the first share renders. Images are cached by URL, and the Sharing Debugger forces a re-scrape. — [Meta, Images in Link Shares](https://developers.facebook.com/docs/sharing/webmasters/images)
  - **WhatsApp (developer reports, no official spec):** previews fail silently above about 300 KB. A 1200×630 JPEG at about 80% quality stays under about 200 KB. — [Andrew Baker, 2026-03-05, snippet only](https://andrewbaker.ninja/2026/03/05/the-hitchhikers-guide-to-fixing-why-a-thumbnail-image-does-not-show-for-your-article-on-whatsapp-linkedin-twitter-or-instagram/)
  - **Apple Messages:** images ≥900 px wide, and the main resource ≤1 MB. — [Apple TN2444 (older, archived), snippet only](https://developer.apple.com/library/archive/technotes/tn2444/_index.html)

**In-app browser limitations**
- **Script injection (Krause, 2022):**
  - Instagram, Facebook and Messenger on iOS (and Instagram on Android) inject `pcm.js` into third-party pages in their WKWebView browsers.
  - WhatsApp opened links in Safari at the time.
  - TikTok's in-app browser injected code able to observe keystrokes and taps.
  - Meta said the script respects App Tracking Transparency (ATT) choices.
  - — [Felix Krause, 2022-08-10](https://krausefx.com/blog/ios-privacy-instagram-and-facebook-can-track-anything-you-do-on-any-website-in-their-in-app-browser); [Krause, InAppBrowser.com, 2022-08-18](https://krausefx.com/blog/announcing-inappbrowsercom-see-what-javascript-commands-get-executed-in-an-in-app-browser)
- **WebKit:** a commit titled "Payment APIs should be completely disabled in web views into which clients have injected user scripts". — [WebKit commit, 2019 (older), snippet only](https://webkit.googlesource.com/WebKit/+/cb7795624b45af5743b20b3e4e4c0860f1efca17%5E%21/)
- **Stripe's Express Checkout Element, "in-app web view" support table:**
  - Apple Pay is supported in iOS web views, subject to standard eligibility.
  - Google Pay works only if no popup is needed, and in Android web views the host app must enable the Payment Request API.
  - **Link, PayPal, Klarna and Amazon Pay are not supported.**
  - Use the `availablepaymentmethodschange` event to detect wallets and fall back to the Payment Element.
  - — [Stripe Docs, Express Checkout Element, read 2026-10-02](https://docs.stripe.com/elements/express-checkout-element)
- **Google Pay in Android WebView** is possible only from WebView 137 (May 2025). The host app must opt in (androidx.webkit 1.14 and `setPaymentRequestEnabled`); it is off by default. — [Google for Developers Blog, 2025-05-28](https://developers.googleblog.com/en/adding-support-for-google-pay-within-android-webview/)
- **Developer reports conflict** with Stripe's table: Apple Pay is reported missing on checkout links opened in the Facebook or Instagram in-app browser on iOS. — [Square Community, snippet only](https://community.squareup.com/t5/Community-Corner/No-Apple-Pay-on-checkout-links/td-p/213100); [Dodo Payments board, snippet only](https://dodopayments.featurebase.app/p/apple-pay-support-in-meta-facebook-instagram-in-app-browser)
- **Audio:**
  - Chrome allows muted autoplay. Sound needs a prior user interaction, and an AudioContext created before a gesture starts "suspended". — [Chrome for Developers, 2017 (older)](https://developer.chrome.com/blog/autoplay)
  - In Android WebView only the host app can turn off "requires user gesture" for media. — [Android WebSettings (older mirror), snippet only](https://stuff.mit.edu/afs/sipb/project/android/docs/reference/android/webkit/WebSettings.html)
- **Storage:** in-app browser cookies and storage live in the host app's sandbox, so sessions do not carry over to Safari or Chrome. — [link.boo guide, snippet only](https://link.boo/guides/in-app-browser-cookies-explained); [Microsoft Learn, iOS 11 web changes, 2017 (older), snippet only](https://learn.microsoft.com/ar-sa/previous-versions/xamarin/ios/platform/introduction-to-ios11/web)
- **Escaping to the system browser** is fragile and undocumented. iOS `x-safari-https://` works in some apps but not reliably in Instagram; Android `intent://` works; Meta keeps restricting these routes. — [plugwith.me, 2026, snippet only](https://plugwith.me/blog/what-escapes-instagram-in-app-browser-in-2026/)
- **Observed pattern:** theBouquet's recipient page opens on "A gift has arrived for you · TAP ANYWHERE TO UNWRAP". This tap provides the user gesture that audio playback requires. — [thebouquet.me recipient page, observed 2026-10-02](https://thebouquet.me/v/4f60c2cb-7ef1-4604-8af3-660a5753e99f)

**Recipient→sender loop and keepsakes**
- **Observed loops, 2026-10-02:**
  - theBouquet's recipient page ends with "POWERED BY THEBOUQUET.ME · CREATE YOUR OWN →" plus like, share and Ko-fi buttons. — [recipient page](https://thebouquet.me/v/4f60c2cb-7ef1-4604-8af3-660a5753e99f)
  - Attached shows a live counter ("129 518 bouquets sent") and a shared garden. — [attachedapp.com/digital-bouquet](https://www.attachedapp.com/digital-bouquet)
  - DigiBouquet has a public "garden". — [digibouquet.vercel.app/garden](https://digibouquet.vercel.app/garden)
  - theBouquet's free bouquets expire after 14 days, and paid "Supporters" get permanent ones. — [thebouquet.me/create](https://thebouquet.me/create)
  - Flowers (flowerisblooming) sells permanence ("lien… pour toujours", QR code) and an in-app garden that collects "403 fleurs dessinées à la main". — [flowerisblooming.com](https://flowerisblooming.com/)
- **Hotmail footer story:** the founders resisted a "free email" footer suggested by Tim Draper. Low-confidence figures circulate (about 1M users in about 6 months). — [Andrew Chen on Penenberg's "Viral Loop" (older, about 2009), snippet only](https://andrewchen.com/what-im-reading-viral-loop-by-adam-penenberg/)
- **Scale claims without conversion rates:** Paperless Post claims more than 100M holiday cards and invitations received. — [Forbes, 2026-01-05, snippet only, vendor claim](https://www.forbes.com/sites/gabbyshacknai/2026/01/05/inside-paperless-posts-evolution-from-digital-invites-to-cultural-connector/)
- **Behavioural basis for keepsakes and collections:**
  - IKEA effect: self-assembled items are valued more, but only when the task is completed. — [Norton, Mochon & Ariely 2012, Harvard DASH, snippet only](https://dash.harvard.edu/bitstream/handle/1/12136084/norton%20mochon%20ariely%20third%20round%5B1%5D.pdf)
  - Endowment effect: mug owners asked about $5.25, while non-owners would pay about $2.25–2.75. — [Kahneman, Knetsch & Thaler 1990 (older)](https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Behavioral_Decision_Theory/Kahneman_et_al_1990_Experimental_tests.pdf)
  - Goal gradient: a 12-stamp card with 2 stamps pre-filled was completed faster than a 10-stamp card. — [Kivetz, Urminsky & Zheng 2006 (older)](https://business.columbia.edu/sites/default/files-efs/pubfiles/1200/goalgradient.pdf)
  - Set completion: people choose items that complete a set. — [Evers, Inbar & Zeelenberg 2014 (older), cited in City Univ. PDF, snippet only](https://openaccess.city.ac.uk/id/eprint/30490/1/Set_Composition_Induces_People_To_Buy_More.pdf)
- **Digital-gift discount:** people value digital goods less than physical ones because of weaker psychological ownership (5 experiments). — [Atasoy & Morewedge, JCR 2018 (older), snippet only](https://ideas.repec.org/a/oup/jconrs/v44y2018i6p1343-1357..html)
- Digital gifts are sometimes not seen as gifts and are rarely reflected on or reciprocated. — [Kwon et al., CSCW 2017 (older), snippet only](https://eprints.nottingham.ac.uk/38096/)

### Inferences
- **Send modes:**
  - "Partager maintenant": a WhatsApp button using `wa.me/?text=`, then SMS by OS, "Copier le lien", and "Autres…" calling `navigator.share` only when available.
  - "Programmer": the service sends by email or SMS at a local time with a sensible default (for example 9:00 Europe/Paris), with a pending list to edit or cancel.
  - "Lien qui s'ouvre le jour J": a date-locked reveal with a countdown. This suits WhatsApp shares made in advance (unverified pattern; no competitor evidence).
- **Before paying,** show a full-screen "Voici ce que verra [prénom]" preview rendered by the same engine as the recipient page. This answers Moreau et al.'s finding that a delivered gift falling short of expectations hurts value (see §1).
- **Message help:**
  - 3–5 templates per occasion, in French and using "vous" or "tu" as the user chooses (choice not researched).
  - A condolence set written with sobriety.
  - An optional "M'aider à écrire".
  - Cap the length so the card fits a 360 px screen without scrolling, and show a live counter.
- **Server-render the OG tags** for every bouquet URL: a static 1200×630 JPEG under ~250 KB, with a unique URL per image version. Consider a "sealed envelope from Marie" image to preserve the surprise.
- **Payments inside in-app browsers:**
  - Always mount Stripe's Payment Element (card) and add the Express Checkout Element only when `availablepaymentmethodschange` reports wallets.
  - Never make PayPal or Link the only option.
  - Show an illustrated "Ouvrir dans Safari/Chrome" helper only when no wallet is available and the user wants one.
  - Keep drafts on the server with a resume link, because cookies won't follow the user.
- **Recipient page order:**
  1. "Touchez pour ouvrir", which also unlocks audio.
  2. The reveal, with pause, replay and mute.
  3. A free "Dire merci" reply that notifies the sender.
  4. "Envoyer un bouquet en retour à [prénom]", with the sender pre-filled.
  5. "Garder ce bouquet" via an email magic link, leading to "Mon vase / Mon jardin".
  6. A discreet "Créé avec [marque]" credit.
  - Keep calls to action out of the animation, and never show them on condolence bouquets beyond a quiet "merci".
- **Keepsake value:** make received bouquets permanent by default. Competitors use expiry as a paywall, which conflicts with the "keepsake" job and could feel punitive to recipients.

### Gaps
- No published recipient→sender conversion or viral-coefficient data for e-cards, e-gifts or invitations.
- No official WhatsApp or iMessage OG-image specification. The 300 KB WhatsApp limit is developer-reported only.
- No 2024–2026 verification of whether Meta or TikTok in-app browsers still inject scripts, whether Apple Pay works in Facebook, Instagram or Messenger webviews today, or whether WhatsApp on Android now opens links in Custom Tabs. These need real-device tests.
- No documented 2026 way to share to Messenger from mobile web other than the OS share sheet or copy-link (`fb-messenger://share` is undocumented).
- No usage data on scheduled sends, or on French users' preference for "vous" vs "tu" in gift copy.

---

## 7. Performance and motion UX for libraries of animated SVG on mobile (thumbnails vs live animation, lazy loading, symbol reuse, prefers-reduced-motion, battery)

### Takeaway
Browse with static, dimensioned thumbnails. Animate only the item the user is acting on, and only with `transform` and `opacity` on a few groups per flower. Never use filters, blur, masks or path morphing in anything animated. iOS in-app browsers run on WebKit, whose layer-based SVG engine that hardware-accelerates SVG transform animations is still not on by default (July 2026). The 75th-percentile phone is about 9x slower than a current iPhone. Motion must be optional: honour `prefers-reduced-motion`, add your own visible "calm" toggle, and give anything that auto-plays for more than 5 seconds a pause control.

### Cited Findings
**Rendering cost**
- **Chromium (Chrome; Android System WebView is also Chromium-based, but whether it gets the same acceleration is my assumption):**
  - SVG animations have been hardware-accelerated automatically since Chromium 89.
  - `opacity`, `filter` and `transform` are accelerated by default; `background-color` and `clip-path` were announced as "coming soon".
  - The source gives no detail on which SVG elements or properties qualify.
  - — [Chrome for Developers, Kravets, 2021-02-22 (older: 2021)](https://developer.chrome.com/blog/hardware-accelerated-animations)
- **WebKit's Layer-Based SVG Engine (LBSE)** is what brings hardware-accelerated transform animations to SVG in WebKit.
  - As of July 2026 it was **still not enabled by default**.
  - Its first design gave every SVG element a RenderLayer. That caused heavy memory and per-frame overhead on scenes with thousands of shapes (the MotionMark "Suits" test).
  - A June 2026 change creates layers only when needed.
  - No speed-up figures are published.
  - — [Igalia blog, N. Zimmermann, 2026-07-14](https://blogs.igalia.com/nzimmermann/posts/2026-07-14-lbse-conditional-layers/)
- **Filters and blur:**
  - A WebKit bug describes animated SVG with filters as about 5x slower than desktop Chrome. It crashed after about 10 cycles on an iPhone 4s and about 35 on an iPhone X. — [WebKit Bugzilla #191197, about 2018 (older), snippet only](https://bugs.webkit.org/show_bug.cgi?id=191197)
  - Moving blurred content is "prohibitively expensive" on mobile, because blur is a post-processing step redone whenever the content underneath changes. — [Aerotwist, P. Lewis, "Slicing SVG 9 ways" (older; snippet only)](https://aerotwist.com/blog/slicing-svg-9-ways)
- **DOM size:** Lighthouse warns above **800 DOM nodes** and errors above **1,400**. Large DOMs raise style, layout and paint work on every interaction, which hurts INP, and raise memory use. — [web.dev, Wagner, updated 2023-05-09](https://web.dev/articles/dom-size-and-interactivity)
- **Animation runtimes (native React Native test, not mobile web):** on a Sony Xperia Z3, Lottie ran at about 17 FPS and Rive at about 60. The same animation was 46.2 KB as Lottie JSON and 2 KB as Rive, versus 164.5 KB as a GIF. — [Callstack, 2023-01-11](https://callstack.com/blog/lottie-vs-rive-optimizing-mobile-app-animation)
- Rive's own claim: files 10–15x smaller than Lottie. — [Rive blog, snippet only, vendor claim](https://rive.app/blog/rive-as-a-lottie-alternative)

**Thumbnails, lazy loading and lists**
- **Core Web Vitals "good" thresholds**, assessed at the 75th percentile of page loads, separately for mobile and desktop: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. INP replaced FID in 2024. — [web.dev Web Vitals, updated 2024-10-31](https://web.dev/articles/vitals)
- **`content-visibility: auto`** skips layout and paint for offscreen content.
  - In the demo, rendering dropped from 232 ms to 30 ms (about 7x).
  - `contain-intrinsic-size: auto` remembers the last rendered size, which suits infinite lists.
  - Support: Chrome/Edge 85+, Firefox 125+, Safari 18+. It became Baseline "newly available" on 2025-09-15.
  - — [web.dev, updated 2025-09-23](https://web.dev/articles/content-visibility)
- **Native `loading="lazy"`:**
  - On 4G, Chromium starts fetching 1,250 px before the viewport, and 97.5% of lazy images are loaded within 10 ms of becoming visible.
  - Don't lazy-load the LCP or above-the-fold images, and always set width and height.
  - — [web.dev, updated 2024-08-13](https://web.dev/articles/browser-level-image-lazy-loading)
- **Windowing / virtualisation** renders only the visible items and recycles nodes, so the DOM size stays constant. — [web.dev, react-window, 2019 (older)](https://web.dev/articles/virtualize-long-lists-react-window)
- **Pause what isn't visible.** WebKit advises using IntersectionObserver so animations run only while visible, and minimising continuously animating content, which keeps painting even when unseen. — [WebKit blog, "How Web Content Can Affect Power Usage", 2019-08-27 (older)](https://webkit.org/blog/8970/how-web-content-can-affect-power-usage/)
- **Speed and business results:**
  - Across 37 brand sites and more than 30M sessions, a 0.1 s speed gain was associated with +8.4% retail conversions and +9.2% average order value. This is correlational, with 2019 data. — [web.dev "Milliseconds Make Millions" case study, updated 2020-06-24 (older)](https://web.dev/case-studies/milliseconds-make-millions)
  - INP case studies (snippets only): QuintoAndar, −80% INP and +36% conversions year on year; redBus, +7% sales. — [web.dev QuintoAndar](https://web.dev/case-studies/quintoandar-inp), [web.dev redBus](https://web.dev/case-studies/redbus-inp)
- **Shelf layout rules** (Material 3's "Show all" requirement and its limit of about 3 visible carousel items on phones) are covered in §2. — [Material Design 3, Carousel guidelines](https://m3.material.io/components/carousel/guidelines)

**Reduced motion and motion sensitivity**
- **`prefers-reduced-motion`:**
  - Baseline "widely available" since January 2020.
  - It is set in iOS via Settings > Accessibility > Motion, and in Android 9+ via "Remove animations".
  - `reduce` means tone motion down or replace it (for example, swap a scale pulse for an opacity dissolve), not remove all animation.
  - Scaling and panning large objects are named vestibular triggers.
  - — [MDN, modified 2026-06-10](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- **WCAG 2.2.2 Pause, Stop, Hide (Level A):** moving content that starts automatically, lasts more than 5 s and sits alongside other content needs a way to pause, stop or hide it. — [W3C Understanding 2.2.2, updated 2026-08-10](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- **WCAG 2.3.3 Animation from Interactions (AAA):** motion triggered by interaction must be possible to switch off. Colour, opacity and blur changes that don't alter perceived size, shape or position are not "motion animation". Parallax is a named example. — [W3C Understanding 2.3.3, updated 2025-09-16](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- **Apple HIG Motion** (change log September 2025):
  - Add motion purposefully. "Gratuitous or excessive animation" can make people "physically uncomfortable".
  - "Make motion optional." Never use motion as the only carrier of information.
  - "Let people cancel motion"; don't make people wait for an animation, especially a repeated one.
  - visionOS-specific guidance, relevant to a walk-through "corridor":
    - Give people a stationary frame of reference: if "the entire surrounding area appears to move", people "can feel unwell".
    - Avoid rotating the world.
    - Avoid sustained oscillation, especially around **0.2 Hz**.
  - — [Apple HIG, Motion, read 2026-10-02](https://developer.apple.com/design/human-interface-guidelines/motion)
- **Vestibular prevalence:** 35.4% of US adults aged 40+ (NHANES 2001–2004, n=5,086) had vestibular dysfunction on a balance test, with odds rising with age (age breakdown in §2). This measures balance, not screen-motion sensitivity. — [Agrawal et al., Arch Intern Med 2009 (older), PubMed, snippet only](https://pubmed.ncbi.nlm.nih.gov/19468085)
- **iOS live updates:** a WebKit bug reported that `prefers-reduced-motion` did not update live when Reduce Motion was toggled on iOS. — [WebKit Bugzilla #222381, snippet only](https://bugs.webkit.org/show_bug.cgi?id=222381)

**Battery, low-end devices, WebView limits**
- **What browsers already throttle:** inactive pages stop `requestAnimationFrame`, suspend CSS and SVG animations and throttle timers. Declarative CSS animations can be optimised away when content isn't visible. — [WebKit blog 2019 (older)](https://webkit.org/blog/8970/how-web-content-can-affect-power-usage/)
- **`requestAnimationFrame`** pauses in background tabs and hidden iframes. Its rate follows the display (60–144 Hz), so animate by timestamp. — [MDN, modified 2026-08-21](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- **iOS Low Power Mode** caps `requestAnimationFrame` and CSS animations at **30 fps**. — [motion.dev, 2020-10-01 (older)](https://motion.dev/magazine/when-browsers-throttle-requestanimationframe)
- **The phone to design for** (Alex Russell, "The Performance Inequality Gap, 2026"):
  - The 75th-percentile phone is about a **Samsung Galaxy A24 4G** (Helio G99). Low-end devices are **about 9x slower** single-core than current iPhones.
  - The median phone lifespan is over 2 years.
  - Network at the 75th percentile: 9 Mbps down and 100 ms round trip.
  - Budget for a 3 s load: about 2.0 MiB total with 0.3 MiB JS, or 1.2 MiB with 0.62 MiB JS.
  - Fewer than half of origins pass Core Web Vitals on mobile.
  - — [infrequently.org, 2025-11-24](https://infrequently.org/2025/11/performance-inequality-gap-2026/)
- **WKWebView memory:** the limit is dynamic and cannot be raised. Heavy pages, including complex SVG animation per developer reports, can get the web content process killed, which shows up as a reload or blank view. — [Apple Developer Forums 766309, snippet only](https://developer.apple.com/forums/thread/766309)
- **France (Arcep/Crédoc "Baromètre du numérique 2025", n=4,066, fieldwork July–August 2024):**
  - 22% of phones were bought used or refurbished.
  - 27% of people have kept their smartphone 3+ years (+11 points in 4 years).
  - 9 in 10 people aged 12+ own a smartphone.
  - — [Arcep, 2025-03-19](https://www.arcep.fr/cartes-et-donnees/nos-publications-chiffrees/barometre-du-numerique/le-barometre-du-numerique-edition-2025.html)

### Inferences
- **Asset pipeline.** For each species and variant, export three files:
  1. A static thumbnail (AVIF/WebP at 1x and 2x, or a static SVG without animation CSS), used in every grid and shelf.
  2. A "live" SVG with a node budget, used in the composer and the reveal page. Example budget: ≤ 30–60 elements per flower; at about 50 elements, a 30-flower bouquet already reaches about 1,500 nodes, past Lighthouse's 1,400 error level.
  3. A reduced-motion variant that fades in.
  This lets the library grow to thousands of items with no runtime cost when browsing.
- **Motion rules.**
  - Animate only `transform` and `opacity` on whole groups (stem, leaf, petal ring).
  - Bake shadows, glows and textures into static shapes.
  - On iOS the cost is likely paint area and path complexity; on low-end Android it is CPU and main thread. Test both.
- **Idle animation.** In grids, animate only the focused or tapped item, or play one short "bloom" when an item enters view, then stop. Use IntersectionObserver to pause everything offscreen. In the composer, stop idle sway after 2–3 cycles and while the user drags.
- **"Garden corridor" warning.** A corridor that moves the whole scene toward or past the viewer is exactly the large-scale motion that Apple's guidance and WCAG 2.3.3 warn about. Keep a stationary frame and use discrete "steps" with cross-fades rather than continuous camera motion. Offer the plain grid as the default reduced-motion path.
- **Settings.** Add your own visible "Animations: on / calm / off" control. Don't rely on users aged 50–75 knowing the OS setting, or on in-app WebViews passing it through (unverified).
- **Reveal page.**
  - Use a static poster as the LCP.
  - Start the animation on a tap, which also unlocks audio.
  - Provide pause and replay.
- **Test matrix.** A Galaxy A24-class Android inside the Facebook, Messenger and Instagram in-app browsers, plus a 3–5-year-old iPhone in Low Power Mode. Persist composer state so a WKWebView kill is harmless.

### Gaps
- No independent 2023–2026 mobile-web benchmark of Lottie-web vs the Rive web runtime vs CSS/SVG vs canvas for many simultaneous animated items.
- No authoritative measurement of the rendering cost of `<use>`/`<symbol>` reuse. The likely saving is in bytes, not paint, but this is unverified; profile it.
- No 2023–2026 quantitative power data (mW or %/h) for continuous CSS/SVG animation on phones.
- No documentation of `prefers-reduced-motion` behaviour inside the Facebook, Instagram, Messenger, TikTok or WhatsApp WebViews.
- Material Design 3's motion-accessibility page was not retrieved.

---

## 8. The 15 most actionable recommendations for this product

1. **Start every journey from an occasion bouquet, not from the library.**
   - The default path is occasion tile → "Notre suggestion" → Personnaliser → message, music and vase → full-screen preview → pay. That is 4–5 named steps with a progress indicator and autosave.
   - Keep the flower-by-flower builder and the "garden corridor" as a secondary creative mode.
   - Sources:
     - Starting solutions raise satisfaction and purchase value across 9 experiments — [Hildebrand, Häubl & Herrmann 2014 (older)](https://www.alexandria.unisg.ch/236290)
     - Templates rather than a blank slate — [NN/g "Customers as Designers" (older)](https://www.nngroup.com/articles/customers-as-designers/)
     - Wizard rules — [NN/g "Wizards" (older)](https://www.nngroup.com/articles/wizards/)
     - Aquarelle's sur-mesure builder was only 5% of revenue — [La Gazette France 2023](https://www.lagazettefrance.fr/article/aquarelle-com-l-eternel-pouvoir-des-fleurs)

2. **Compose with slots and taps, never a free canvas.**
   - Tapping a flower fills the next slot. A placed flower offers large "Remplacer / Retirer / Couleur" buttons.
   - Instead of drag, resize and rotate, offer "Une autre disposition" (re-arrange) and "Changer le feuillage".
   - Show removable chips ("Rose ×2") and an "Annuler" snackbar after every change.
   - Sources:
     - WCAG 2.2 SC 2.5.7 Dragging Movements (AA) — [W3C](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
     - Apple's "Offer alternatives to gestures" — [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
     - Visible undo — [NN/g user control (older)](https://www.nngroup.com/articles/user-control-and-freedom/)
     - DigiBouquet's auto-arrangement pattern versus theBouquet's tiny canvas handles (observed) — [digibouquet.vercel.app](https://digibouquet.vercel.app/bouquet?mode=color), [thebouquet.me/create](https://thebouquet.me/create)

3. **Keep the sender the author, and preview exactly what the recipient will see.**
   - The user picks or confirms the focal flowers. The system then adds foliage and filler as visible, removable, "included" finishing touches.
   - Before payment, show a full-screen "Voici ce que verra [prénom]" preview rendered by the recipient page's own engine.
   - Sources:
     - Willingness to pay for self-designed items is 44–62% higher, driven by accomplishment and conditional on an attractive result — [Franke, Schreier & Kaiser 2010 (older)](https://www.wu.ac.at/fileadmin/wu/d/i/entrep/4_forschung/full-text-papers/franke_schreier_kaiser_2010_designed_it_myself.pdf)
     - AI help lowers felt accomplishment — [Pflanzer & Spann, EMAC 2025](https://proceedings.emac-online.org/pdfs/A2025-124513.pdf)
     - Gift-givers are more disappointed when the delivered gift falls short of raised expectations — [Moreau, Bonney & Herd 2011 (older)](https://www-business.media.uconn.edu/wp-content/uploads/sites/969/2018/04/2011_JM_Its-the-Thought-That-Counts.pdf)

4. **Sell bouquet "containers", not a per-flower taximeter.**
   - Three fixed sizes (for example €4.90 / €9.90 / €14.90), each including N focal flowers plus foliage, filler and a card.
   - Common flowers are "inclus". Rare and precious flowers show only as swap differences ("+€0.40") in €0.10–0.50 steps, with an optional spend cap.
   - Never display 1–5-cent prices.
   - Sources:
     - Coupling of payment and consumption — [Prelec & Loewenstein 1998 (older)](https://pubsonline.informs.org/doi/10.1287/mksc.17.1.4)
     - Flat-rate bias and the taximeter effect — [Lambrecht & Skiera 2006 (older)](https://www.london.edu/faculty-and-research/academic-research/p/paying-too-much-and-being-happy-about-it-existence-causes-and-con)
     - Transaction decoupling — [Soman & Gourville 2001 (older)](https://inn.theorizeit.org/Details/Paper/10050?databaseId=3a0e27b9-8e00-43b0-a1c6-a3c800e66229)
     - Bloom AR app: a 1★ review of its $0.99-per-flower unlocks, followed by an update making "more flowers free" — [iTunes reviews RSS](https://itunes.apple.com/us/rss/customerreviews/page=1/id=6744581621/sortby=mostrecent/json), [App Store](https://apps.apple.com/us/app/bloom-flower-arrangement/id6744581621)

5. **Set the floor at about €4.90–5 and never take single-flower payments.**
   - Stripe France charges 1.5% + €0.25 on standard EEA cards, 2.8% + €0.25 on premium EEA cards, and a €20 fee per dispute.
   - The fixed fee eats 26.5% of a €1 basket, 6.5% of a €5 basket, and stays at or below 5% only from €7.14.
   - A threshold perk (for example music included from about €12) can lift baskets, but model the giveaway cost first.
   - Sources:
     - Fees — [stripe.com/fr/pricing (verified 2026-10-02)](https://stripe.com/fr/pricing)
     - Thresholds lift sales but can be unprofitable — [Lewis, Singh & Fay 2006 (older)](https://ideas.repec.org/a/inm/ormksc/v25y2006i1p51-64.html)

6. **Show one all-in price including VAT on every screen, and never add a fee at checkout.**
   - The total is shown as progress against the chosen size ("€7.40 sur €9.90").
   - Add-ons (music, vase) are priced separately and update the total instantly.
   - Sources:
     - Extra costs are the #1 reason for abandonment (40%), and 12% abandon because they can't see the total — [Baymard](https://baymard.com/lists/cart-abandonment-rate)
     - French all-in price rule — [economie.gouv.fr](https://www.economie.gouv.fr/entreprises/professionnels-quelles-sont-vos-obligations-en-matiere-daffichage-des-prix)
     - Drip pricing lowers satisfaction — [Santana, Dallas & Morwitz 2020 (older)](https://business.columbia.edu/faculty/press/consumer-reactions-drip-pricing)
     - Running totals cut spending by people without a budget (about −19%) and raise it for budget shoppers (about +22%) — [van Ittersum et al. 2013 (older)](https://www.rug.nl/feb/news/2013/130904ittersum?lang=en)

7. **Make rarity a transparent, deterministic tier in euros.**
   - 3–4 tiers ("Commune / Rare / Précieuse / Légendaire") shown as a label, an icon and a frame or badge on the card, never as a tint on the flower.
   - No credits-only prices, leftover-forcing packs, paid random outcomes, countdowns or fake scarcity. "Surprise me" stays free and only *proposes* a bouquet.
   - Sources:
     - Prices in real money, no forced surplus currency, vulnerable-consumer design — [CPC key principles, 2025 (European Commission)](https://commission.europa.eu/live-work-travel-eu/consumer-rights-and-complaints/enforcement-consumer-protection/coordinated-actions/social-media-online-games-and-search-engines_en), [Linklaters summary](https://techinsights.linklaters.com/post/102k6t4/game-changer-eu-introduces-consumer-protection-guidance-for-in-game-virtual-curr)
     - Colour must not be the only cue — [WCAG 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
     - Blue–yellow discrimination declines with age — [Costa et al. 2023](https://www.frontiersin.org/journals/integrative-neuroscience/articles/10.3389/fnint.2023.1129315/full)
     - Digital Fairness Act proposal due Q4 2026 — [EP Legislative Train](https://www.europarl.europa.eu/legislative-train/theme-protecting-our-democracy-upholding-our-values/file-digital-fairness-act)

8. **Browse by named colour family, occasion and meaning, in a vertical grid with "Voir plus".**
   - One card per *species*, with colour variants as a swatch row whose last swatch is cut off. Never one card per variant, and never long-press-only.
   - 8–12 colour families, each with a swatch and a French label, computed automatically from the SVG fills.
   - Load 15–30 cards per batch, then "Voir plus" with a visible count. Keep the scroll position on Back.
   - Search tolerates misspellings and synonyms.
   - Sources:
     - Visual filters with thumbnails — [Baymard 2024](https://baymard.com/blog/use-visual-filters-for-visually-distinct-product-attributes)
     - Swatches in mobile product lists — [Baymard 2023](https://baymard.com/blog/mobile-interactive-color-swatches)
     - "Load more" beats pagination and infinite scroll — [Baymard via Smashing 2016 (older)](https://www.smashingmagazine.com/2016/03/pagination-infinite-scrolling-load-more-buttons/), [NN/g 2022](https://www.nngroup.com/articles/infinite-scrolling-tips/)
     - Interflora FR colour navigation — [interflora.fr](https://www.interflora.fr/)
     - Interflora UK's 2013 builder filtered by colour, type and meaning — [blog (older)](https://www.lavenderandlovage.com/2013/01/a-floral-fantasy-design-and-deliver-your-own-floral-bouquet-on-line.html)

9. **Ship the "garden corridor" as an optional "Balade" mode on top of the grid.**
   - One aisle per colour family, with fixed slots.
   - Move bay by bay with buttons and short cross-fades: no continuous camera motion, no scroll-jacking, a stationary frame.
   - Every horizontal shelf ends in "Tout voir", which opens a vertical grid.
   - Under reduced motion, transitions are instant.
   - Sources:
     - Carousels need a "Show all" alternative and show about 3 items on phones — [Material 3 carousel](https://m3.material.io/components/carousel/guidelines)
     - Scrolljacking disorients users — [NN/g 2023](https://www.nngroup.com/articles/scrolljacking-101/)
     - Stationary frame and no world motion — [Apple HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
     - 3D hurt retrieval — [Cockburn & McKenzie 2002 (older)](https://courses.washington.edu/hcde511/a14/readings/cockburn-chi02.pdf)
     - 35% of US adults 40+ have vestibular dysfunction — [Agrawal 2009 (older)](https://pubmed.ncbi.nlm.nih.gov/19468085)
     - theBouquet's 85-item single-row shelf (observed) — [thebouquet.me/create](https://thebouquet.me/create)

10. **Use occasion tiles with one endorsed suggestion plus 2–3 clearly different alternatives, and a separate condolence mode.**
    - 6–8 large occasion tiles, plus an optional 2–3-question refinement (pour qui, couleurs préférées, humeur) that can be skipped.
    - Show 1 "Notre suggestion" hero and 2–3 alternatives that differ on one axis (palette or size/price), at most about 6 before "Voir d'autres".
    - "Une autre proposition" regenerates within per-occasion rules and keeps history and undo.
    - Condolences:
      - sober palette with ≥4.5:1 text contrast;
      - calm animation;
      - no surprise button, upsell or rarity badges;
      - the option to schedule for the ceremony;
      - chrysanthemums allowed only here.
    - Sources:
      - Defaults work best when they signal endorsement (d=0.68) — [Jachimowicz et al. 2019 (older)](https://ideas.repec.org/a/cup/bpubpo/v3y2019i02p159-186_00.html)
      - Choice-overload moderators — [Chernev et al. 2015 (older)](https://www.kellogg.northwestern.edu/faculty/research/detail/2015/when-product-assortment-leads-to-choice-overload-a-conceptual)
      - Separate mourning path timed to the ceremony — [Interflora FR Deuil](https://www.interflora.fr/c/deuil)
      - French mourning flowers — [Advitam](https://en--meb-prod.advitam.fr/howto-funeral/funeral-legal-framework/flowers-mourning-meanings)

11. **Turn the recipient page into the growth engine and a keepsake.**
    - Order of the page:
      1. "Touchez pour ouvrir" (this also unlocks audio).
      2. The reveal, with pause, replay and mute.
      3. A free "Dire merci" reply that notifies the sender.
      4. "Envoyer un bouquet en retour à [prénom]", pre-filled.
      5. "Garder ce bouquet": an email magic link to "Mon vase / Mon jardin".
      6. A discreet "Créé avec…" credit.
    - Received bouquets are permanent by default.
    - Measure the loop yourself: K ≈ opens × CTA click-through × conversion. No public benchmark exists.
    - Sources:
      - theBouquet's tap-to-unwrap gate and "Create your own" footer (observed) — [thebouquet.me recipient page](https://thebouquet.me/v/4f60c2cb-7ef1-4604-8af3-660a5753e99f)
      - e-card reply and "viewed" status features — [Jacquie Lawson FAQ, snippet only](https://www.jacquielawson.com/faq/3496)
      - Digital goods are valued less unless they feel owned — [Atasoy & Morewedge 2018 (older)](https://ideas.repec.org/a/oup/jconrs/v44y2018i6p1343-1357..html)
      - Sound needs a user gesture — [Chrome autoplay policy (older)](https://developer.chrome.com/blog/autoplay)

12. **Build the UI for 50–75-year-old eyes and hands.**
    - Body text 17–18 px with line height 1.5, ≥4.5:1 contrast, and working at 200% text size.
    - Touch targets ≥48×48 px with spacing between them.
    - One decision per screen, with a persistent "Retour", autosave and no timeouts.
    - Plain-French inline errors.
    - A visible human contact, plus a "Faire avec un proche" link.
    - Sources:
      - Small, light text and small targets hurt seniors — [NN/g older adults (older)](https://www.nngroup.com/articles/usability-for-senior-citizens/)
      - 44 pt controls, 200% text, alternatives to gestures — [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
      - 48 dp (about 9 mm) targets — [Material 3](https://m3.material.io/foundations/designing/structure)
      - 60% of 60–74-year-olds and 88% of 75+ have no or weak digital skills — [INSEE 2025](https://www.insee.fr/fr/statistiques/8616801)
      - Preference for human help — [Arcep 2026](https://www.arcep.fr/uploads/tx_gspublication/barometre-du-numerique-edition-2026_INFOGRAPHIE.pdf)

13. **Make checkout guest-only, card-first and legally clean.**
    - About 5–7 fields.
    - The card form (CB/Visa/Mastercard) is always present. Apple Pay and Google Pay appear only when Stripe's `availablepaymentmethodschange` reports them. PayPal appears only outside in-app browsers.
    - An unticked "accès immédiat / je renonce à mon droit de rétractation" checkbox, confirmed in the receipt email.
    - A trust block: company name, SIREN, address, mentions légales, contact.
    - Sources:
      - Guest-checkout prominence; 24% abandon over forced accounts — [Baymard 2023](https://baymard.com/research-articles/make-guest-checkout-prominent)
      - Card 53% and e-wallets 27% (PayPal about 18%) of French online payments — [Banque de France 2025](https://www.banque-france.fr/system/files/2025-02/BDF256-1_Habitudes_paiement_web.pdf)
      - Wallet support in in-app webviews — [Stripe Express Checkout Element](https://docs.stripe.com/elements/express-checkout-element)
      - Express waiver required for digital content — [Your Europe](https://europa.eu/youreurope/citizens/consumers/shopping/returns/index_en.htm)
      - 10% hesitate over an "unknown company", 12% over payment security — [Arcep 2026](https://www.arcep.fr/uploads/tx_gspublication/barometre-du-numerique-edition-2026_INFOGRAPHIE.pdf)

14. **Engineer for the Facebook, Messenger and WhatsApp webviews.**
    - Drafts, orders and gardens live on the server, with resume and magic links.
    - A large WhatsApp button using `wa.me/?text=` (it opens the contact picker), plus SMS by OS, "Copier le lien", and `navigator.share` only when available.
    - Server-rendered OG tags with a 1200×630 JPEG under about 250 KB, and a new URL for each image version.
    - An illustrated "Ouvrir dans le navigateur" helper, shown only when a wallet is missing and the user wants one.
    - Test every wallet and audio path on real iOS and Android devices inside Facebook, Messenger, Instagram and TikTok.
    - Sources:
      - `wa.me/?text=` behaviour — [WhatsApp Help Center](https://faq.whatsapp.com/5913398998672934)
      - Link-share image specs — [Meta link-share images](https://developers.facebook.com/docs/sharing/webmasters/images)
      - Script injection in Meta and TikTok in-app browsers — [Krause 2022](https://krausefx.com/blog/ios-privacy-instagram-and-facebook-can-track-anything-you-do-on-any-website-in-their-in-app-browser)
      - Google Pay works in Android WebView only if the host app opts in — [Google Developers Blog 2025-05-28](https://developers.googleblog.com/en/adding-support-for-google-pay-within-android-webview/)
      - Messenger Send Dialog is not supported on mobile — [Meta Send Dialog](https://developers.facebook.com/docs/sharing/reference/send-dialog)

15. **Keep animation cheap, pausable and optional.**
    - Browsing grids use static AVIF/WebP thumbnails. Only the tapped or visible item animates, once.
    - Live SVGs animate only `transform` and `opacity` on a few groups: no filters, blur, masks or path morphing, and about 30–60 elements per flower.
    - Pause off-screen content with IntersectionObserver and use `content-visibility: auto`.
    - Honour `prefers-reduced-motion` *and* offer your own "Animations : normales / calmes / off" toggle.
    - Pause and replay on the reveal page.
    - Test on a Galaxy A24-class Android and an older iPhone in Low Power Mode (30 fps).
    - Sources:
      - WebKit's layer-based SVG engine is still off by default — [Igalia 2026-07-14](https://blogs.igalia.com/nzimmermann/posts/2026-07-14-lbse-conditional-layers/)
      - DOM size thresholds of 800 and 1,400 nodes — [web.dev](https://web.dev/articles/dom-size-and-interactivity)
      - Pause, Stop, Hide for motion over 5 s — [WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
      - prefers-reduced-motion — [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
      - The 75th-percentile device is about 9× slower than an iPhone — [Russell 2025](https://infrequently.org/2025/11/performance-inequality-gap-2026/)
