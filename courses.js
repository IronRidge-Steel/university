/* ============================================================
   IRONRIDGE UNIVERSITY — course content
   ------------------------------------------------------------
   HOW TO ADD SHANE'S SCREEN-RECORDING VIDEOS:
   Upload the recording to YouTube (set to Unlisted), copy the
   video ID from the URL (the part after "watch?v="), and paste
   it below where you see  yt: null.  Example:
     ghlWalkthrough: { yt: "dQw4w9WgXcQ" },
   A blank yt (null) shows a "coming soon" placeholder instead.
   ============================================================ */

var IRU_CONFIG = {
  accessCode: "ironridge980",        // reps type this to log in — change anytime
  trainers: ["Shane DeThomasis", "Rob Sorce"],   // these names see the answer-key + admin tools
  passPctDefault: 80,                // default quiz pass threshold
  examPassCount: 13,                 // certification exam: 13 of 15
  version: "1.0 — Nov 2026"
};

var IRU_VIDEOS = {
  build4060: { yt: "_Oago5isnT0", label: "What I Wish I Knew BEFORE Building a 40x60 Metal Shop (Piney Grove Homestead)" },
  buildStep: { yt: "jjgn5SOgk7I", label: "Step by Step — How to Build a Metal Building (Piney Grove Homestead)" },

  /* ---- Shane's screen recordings ----
     Two ways to attach a video:
       yt: "dQw4w9WgXcQ"          YouTube video ID (Unlisted), OR
       loom: "3e30386f..."         Loom video ID (the hex string from the share URL).
     IMPORTANT: in Loom, each video must be set to "Anyone with the link can
     view" (Video page -> Share -> link settings), or reps will hit a login wall.
     A blank field (null) shows the "coming soon" placeholder. */
  ghlConversations:     { yt: null, loom: "3e30386fad104521b58946cf045559fe", label: "GHL Conversations Overview & the AI Lead Flow", record: "Watch the Conversations view and how the AI lead flow texts and emails new leads before a rep ever touches them." },
  ghlWalkthrough:      { yt: null, loom: "2d8a123e48a946e5ba58a722c80fd984", label: "Calling & Following Up with Prospects", record: "Shane calling and following up with prospects in GHL." },
  senseiWalkthrough:   { yt: null, loom: "3f142e8d71804f33b1ba82eaa4df49eb", label: "Building 3D Quotes in Sensei 2.0", record: "Shane building a quote in Sensei 2.0." },
  ghlPipelineStages:   { yt: null, loom: "6ca1846558414abcbc0564e24bcccf68", label: "Managing Pipeline Stages and Automations", record: "Shane working pipeline stages and the automations behind them in GHL." },
  ghlQuoteDetails:     { yt: null, loom: "f2d97ed8dedb42248700cf822e62cb58", label: "Sales Pipeline Stages and Quote Details", record: "How pipeline stages and quote details interact in GHL." },
  senseiOptions:       { yt: null, loom: "3d4ba0f1826c4a799816ad26a2874bf6", label: "Walk-In Door, Windows, Colors, Insulation Options", record: "Configuring options in Sensei: walk-in doors, windows, colors, insulation." },
  senseiSending:       { yt: null, loom: "83607dbb832041179d7b74fc43be2acf", label: "Sending and Editing Construction Quotes", record: "Sending and editing construction quotes in Sensei." },
  quoteAttachGhl:     { yt: null, loom: "1ba0c80d83194f39ae2167390e7cfeab", label: "GHL — Quote to Order Workflow", record: "The full GHL flow: quote sent through order handoff — attach, note, stage moves, Order In Progress." },
  depositInvoice:      { yt: null, loom: null, label: "Collecting the Deposit in GHL", record: "Screen-record moving a deal to Deposit Requested and sending the deposit invoice through GHL. Point out where the invoice states deposits are non-refundable." },

  /* ---- Shane's filmed Loom library (Nov 2026) — IDs known, mapping pending ----
     These 8 need: (1) "Anyone with the link" privacy in Loom, (2) matching to
     the right course slots. Do NOT delete this list — it is the master record. */
  shaneLoomLibrary: { note: "ALL 8 PUBLIC since Nov 17 evening. Full map by original paste order: 1=ghlConversations, 2=ghlWalkthrough, 3=ghlPipelineStages (Shane first thought this was quote-to-order; it is NOT - that is #8), 4=ghlQuoteDetails, 5=senseiWalkthrough, 6=senseiOptions, 7=senseiSending, 8=quoteAttachGhl", ids: [
    "3e30386fad104521b58946cf045559fe",
    "2d8a123e48a946e5ba58a722c80fd984",
    "6ca1846558414abcbc0564e24bcccf68",
    "f2d97ed8dedb42248700cf822e62cb58",
    "3f142e8d71804f33b1ba82eaa4df49eb",
    "3d4ba0f1826c4a799816ad26a2874bf6",
    "83607dbb832041179d7b74fc43be2acf",
    "1ba0c80d83194f39ae2167390e7cfeab"
  ] }
};

/* Helper strings reused across lessons */
var SAY = function (txt) { return '<div class="say-box">' + txt + '</div>'; };

/* ============================================================
   COURSES
   ============================================================ */
var IRU_COURSES = [

/* ---------------------------------------------------------- 1 */
{
  id: "c1", num: 1,
  title: "Foundations: IronRidge & the Non-Negotiables",
  desc: "How the business works, how you get paid, and the rules you cannot break.",
  lessons: [
    { id: "c1l1", type: "lesson", title: "Welcome — How This Program Works", minutes: 8, body: `
<p>Welcome to IronRidge University. This program takes you from zero metal-building knowledge to a <b>certified IronRidge sales rep</b>. It mirrors the four-day live onboarding: you work through the courses in order, pass each quiz, and finish with the Certification Exam.</p>
<h3>How it works</h3>
<ul>
<li><b>Courses unlock in order.</b> You cannot skip ahead — the same way a live trainer would not let you quote before you know the product.</li>
<li><b>Lessons</b> end with a "Mark complete" button. <b>Videos</b> must be watched. <b>Quizzes</b> must be passed (usually 80% or better) before the next course opens.</li>
<li>Your progress saves automatically on this device under your name. Don't sign in under a different name or your progress won't follow you.</li>
</ul>
<h3>The three gates (same as live training)</h3>
<ol>
<li><b>Knowledge check</b> — the certification questions, answered without notes.</li>
<li><b>Solo quote</b> — you build correct quotes in Sensei alone.</li>
<li><b>Certification</b> — full-lifecycle role-play plus two scored live calls with your trainer.</li>
</ol>
<p>Online courses cover the knowledge. The gates happen live with Shane or a certified senior rep — the exam at the end of this program is Gate 1.</p>
<div class="callout"><b>Your job in one sentence:</b> talk to people, find out what they need and why, get them the right building, and collect a deposit. Everything in this program exists to make that repeatable.</div>
` },
    { id: "c1l2", type: "lesson", title: "The Business Model & Your Pay", minutes: 10, body: `
<h3>What IronRidge is</h3>
<p>IronRidge is a <b>dealer</b>, not a manufacturer. We design, quote, and sell custom steel buildings; our manufacturing partners build, deliver, and install them. We shop multiple manufacturers to get the customer the best building at the best price — that transparency is the pitch. The customer only ever deals with IronRidge.</p>
<h3>How the money works</h3>
<ul>
<li>The customer pays a <b>deposit</b> to place the order. The rest is due at install (or financed).</li>
<li><b>The deposit is IronRidge's revenue.</b> The remaining balance goes to the manufacturer.</li>
<li>There is no fixed deposit percentage — the amount shows on the Sensei quote as "Downpayment." Never quote a percentage.</li>
<li><b>You earn 30% of the deposit</b>, paid bi-weekly on cleared deposits. Chargebacks are handled on a case-by-case basis.</li>
<li><b>Bigger building = bigger deposit = bigger commission.</b> A 40×60 shop can pay several times what a small carport pays. Never under-size a buyer to make the number easier.</li>
</ul>
<figure>
<svg class="diagram" viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg">
  <rect x="230" y="10" width="180" height="46" rx="9" fill="#9E2A2B"/>
  <text x="320" y="38" text-anchor="middle" fill="#fff" font-size="15" font-weight="700">CUSTOMER</text>
  <rect x="20" y="95" width="190" height="52" rx="9" fill="#fff" stroke="#1A1A1A" stroke-width="1.5"/>
  <text x="115" y="117" text-anchor="middle" font-size="13" font-weight="700" fill="#1A1A1A">IronRidge</text>
  <text x="115" y="134" text-anchor="middle" font-size="11" fill="#555">deposit = revenue</text>
  <rect x="430" y="95" width="190" height="52" rx="9" fill="#fff" stroke="#9E2A2B" stroke-width="1.5" stroke-dasharray="5 4"/>
  <text x="525" y="117" text-anchor="middle" font-size="13" font-weight="700" fill="#1A1A1A">Manufacturer</text>
  <text x="525" y="134" text-anchor="middle" font-size="11" fill="#555">balance at install</text>
  <line x1="270" y1="56" x2="150" y2="93" stroke="#9E2A2B" stroke-width="2.5" marker-end="url(#arrR)"/>
  <line x1="370" y1="56" x2="500" y2="93" stroke="#999" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#arrG)"/>
  <text x="150" y="175" text-anchor="middle" font-size="12" font-weight="700" fill="#9E2A2B">30% → rep commission</text>
  <defs>
    <marker id="arrR" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#9E2A2B"/></marker>
    <marker id="arrG" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#999"/></marker>
  </defs>
</svg>
<div class="diagram-cap">The customer pays one deposit to IronRidge; the manufacturer is paid the balance. Your commission is 30% of the deposit.</div>
</figure>
<h3>What we sell and where</h3>
<p>Carports, garages, combo units, barns, RV and boat covers, workshops, and commercial buildings — all custom-sized. We sell across roughly 38 states, with a deep focus on the snow belt: Michigan, Wisconsin, and Minnesota, where buildings engineered up to <b>90 PSF snow load</b> win deals.</p>
` },
    { id: "c1l3", type: "lesson", title: "The Non-Negotiables", minutes: 10, body: `
<p>Break one of these and the deal — or the account — is at risk. These come up on every call, so they need to be automatic.</p>
<table>
<tr><th>Rule</th><th>Say this instead</th></tr>
<tr><td><b>Never tell a customer they do or don't need a permit</b></td><td>"That's set by your county. Your building department can confirm, and engineered drawings come with your building."</td></tr>
<tr><td><b>Never promise an install date</b></td><td>"Lead time runs a few weeks from order. Scheduling calls you to set the date."</td></tr>
<tr><td><b>Never quote a price you haven't built in Sensei</b></td><td>"Let me build that out properly so the number is real."</td></tr>
<tr><td><b>Never quote a fixed deposit percentage</b></td><td>"Your deposit is right on the quote."</td></tr>
<tr><td><b>Never call a customer from your personal cell</b></td><td>Dial through the GHL app on the 980 line, every time. Calls outside GHL don't exist as far as the scorecard is concerned.</td></tr>
<tr><td><b>Never offer a discount before you know the real objection</b></td><td>Diagnose first (Course 6).</td></tr>
<tr><td><b>Never take card numbers by text or email</b></td><td>Send the invoice through GHL, or take the card by phone.</td></tr>
</table>
<h3>Who builds it</h3>
<p>A customer may ask who makes the building. We're a dealer and we're upfront about that: <b>"We shop multiple manufacturers to get you the best building at the best price. You're buying from IronRidge, and we handle everything start to finish."</b> Manufacturing line names and which line serves which state are <b>rep-only knowledge</b> — you use them to pick who to quote, not to advertise.</p>
<h3>Division of labor (get this right)</h3>
<ul>
<li><b>The manufacturer handles:</b> permits where offered, engineered drawings, building, delivery, install scheduling.</li>
<li><b>IronRidge handles:</b> site prep and concrete coordination with the customer.</li>
</ul>
<div class="callout"><b>The brand is one word: IronRidge</b> — never "Iron Ridge." Phone 980-550-5660, website ironridgesteel.com.</div>
` },
    { id: "c1q", type: "quiz", title: "Course 1 Quiz", questions: [
      { q: "IronRidge is a…", choices: ["Manufacturer that builds its own buildings", "Dealer that sells buildings built by manufacturing partners", "Broker that only sells leads"], a: 1, why: "We design, quote, and sell; our manufacturing partners build, deliver, and install." },
      { q: "IronRidge's revenue on a deal is…", choices: ["The full building price", "The customer deposit only", "A flat fee per building"], a: 1, why: "The deposit is IronRidge's revenue; the balance goes to the manufacturer." },
      { q: "You earn…", choices: ["30% of the building total", "30% of the deposit", "A flat rate per deal"], a: 1, why: "1099 reps earn 30% of the deposit, paid bi-weekly on cleared deposits." },
      { q: "A customer asks what percentage the deposit is. You say…", choices: ["\"It's 20% of the building.\"", "\"There isn't a fixed percentage — your deposit is right on the quote.\"", "\"It depends on your credit.\""], a: 1, why: "Never quote a fixed deposit percentage. It shows on the Sensei quote as Downpayment." },
      { q: "A customer asks if they need a permit. You…", choices: ["Tell them no for buildings under 400 sq ft", "Tell them yes, always", "Say their county decides and the building department can confirm; engineered drawings come with the building"], a: 2, why: "Never answer the permit question yes or no." },
      { q: "Who sets the install date?", choices: ["You do, at order", "The scheduling team calls the customer to set it", "The customer picks any date they want"], a: 1, why: "Never promise an install date — scheduling calls the customer." },
      { q: "You make all customer calls…", choices: ["From your personal cell so the customer can reach you", "Through the GHL app on the 980 line", "From whatever phone is closest"], a: 1, why: "Calls outside GHL aren't logged — as far as the scorecard is concerned they didn't happen." },
      { q: "A customer says \"your competitor is cheaper.\" You first…", choices: ["Match their price", "Offer a discount", "Diagnose what's actually behind it and compare spec for spec"], a: 2, why: "Never offer a discount before you know the real objection." },
      { q: "Who handles site prep and concrete coordination?", choices: ["The manufacturer", "IronRidge", "The customer, always alone"], a: 1, why: "IronRidge handles site prep and concrete coordination; the manufacturer handles permits, drawings, and scheduling." }
    ] }
  ]
},

/* ---------------------------------------------------------- 2 */
{
  id: "c2", num: 2,
  title: "Product Knowledge",
  desc: "Building types, roof styles, steel specs, snow load, install, permits, and how the customer pays.",
  lessons: [
    { id: "c2l1", type: "lesson", title: "Building Types", minutes: 10, body: `
<p>You don't need to be an engineer. You need to recommend the right building in plain English and know which questions change the price. Default recommendation: <b>vertical roof, sized to the job, engineered for the customer's location.</b></p>
<div class="type-cards">
<div class="type-card">
<svg width="120" height="58" viewBox="0 0 120 58"><path d="M10 46 L60 12 L110 46" fill="none" stroke="#9E2A2B" stroke-width="4"/><line x1="18" y1="46" x2="102" y2="46" stroke="#1A1A1A" stroke-width="4"/></svg>
<h4>Carport</h4><p>Open-sided roof over vehicles; 1–3 car widths. Cover for cars, budget-first buyers.</p></div>
<div class="type-card">
<svg width="120" height="58" viewBox="0 0 120 58"><path d="M10 46 L60 12 L110 46" fill="none" stroke="#9E2A2B" stroke-width="4"/><line x1="10" y1="46" x2="110" y2="46" stroke="#1A1A1A" stroke-width="4"/><line x1="10" y1="46" x2="10" y2="18" stroke="#1A1A1A" stroke-width="3"/><line x1="110" y1="46" x2="110" y2="18" stroke="#1A1A1A" stroke-width="3"/><line x1="10" y1="18" x2="110" y2="18" stroke="#1A1A1A" stroke-width="3"/></svg>
<h4>Garage</h4><p>Fully enclosed with roll-up doors, walk-in door, windows. Secure storage, workshops.</p></div>
<div class="type-card">
<svg width="120" height="58" viewBox="0 0 120 58"><path d="M6 46 L36 20 L66 46" fill="none" stroke="#9E2A2B" stroke-width="4"/><rect x="66" y="24" width="48" height="22" fill="none" stroke="#1A1A1A" stroke-width="3"/><line x1="6" y1="46" x2="114" y2="46" stroke="#1A1A1A" stroke-width="4"/></svg>
<h4>Combo unit</h4><p>Open carport section plus an enclosed storage room in one footprint.</p></div>
<div class="type-card">
<svg width="120" height="58" viewBox="0 0 120 58"><path d="M6 46 L34 14 L62 46" fill="none" stroke="#9E2A2B" stroke-width="4"/><path d="M62 46 L78 24 L94 46" fill="none" stroke="#9E2A2B" stroke-width="3"/><path d="M94 46 L110 24 L118 46" fill="none" stroke="#9E2A2B" stroke-width="3"/><line x1="6" y1="46" x2="118" y2="46" stroke="#1A1A1A" stroke-width="4"/></svg>
<h4>Barn</h4><p>Taller center section with lean-to sides. Equipment, livestock, hay.</p></div>
<div class="type-card">
<svg width="120" height="58" viewBox="0 0 120 58"><path d="M10 40 L60 6 L110 40" fill="none" stroke="#9E2A2B" stroke-width="4"/><line x1="10" y1="40" x2="110" y2="40" stroke="#1A1A1A" stroke-width="4"/><line x1="10" y1="40" x2="10" y2="26" stroke="#1A1A1A" stroke-width="3"/><line x1="110" y1="40" x2="110" y2="26" stroke="#1A1A1A" stroke-width="3"/><line x1="10" y1="26" x2="110" y2="26" stroke="#1A1A1A" stroke-width="3"/></svg>
<h4>RV / boat cover</h4><p>Extra-tall carport or garage built to protect a big vehicle.</p></div>
<div class="type-card">
<svg width="120" height="58" viewBox="0 0 120 58"><path d="M6 46 L60 16 L114 46" fill="none" stroke="#9E2A2B" stroke-width="4"/><rect x="6" y="46" width="108" height="8" fill="#1A1A1A"/></svg>
<h4>Workshop / commercial</h4><p>Wide clear-span enclosed buildings — 40×60 and up. Shops, businesses, farms.</p></div>
</div>
<div class="callout green"><b>Commission lens:</b> a 40×60 shop is roughly 10× the commission of a small carport. When a buyer has the need and the budget, never under-size them.</div>
` },
    { id: "c2l2", type: "lesson", title: "Roof Styles & Steel Specs", minutes: 12, body: `
<h3>Roof styles</h3>
<figure>
<svg class="diagram" viewBox="0 0 640 190" xmlns="http://www.w3.org/2000/svg">
  <g>
    <path d="M20 100 Q90 30 160 100" fill="none" stroke="#1A1A1A" stroke-width="4"/>
    <line x1="20" y1="100" x2="160" y2="100" stroke="#1A1A1A" stroke-width="4"/>
    <line x1="45" y1="72" x2="60" y2="58" stroke="#9E2A2B" stroke-width="2" marker-end="url(#a2)"/>
    <text x="90" y="128" text-anchor="middle" font-size="13" font-weight="700" fill="#1A1A1A">Regular</text>
    <text x="90" y="146" text-anchor="middle" font-size="11" fill="#555">panels run side-to-side</text>
    <text x="90" y="162" text-anchor="middle" font-size="11" fill="#555">rounded eaves — cheapest</text>
  </g>
  <g>
    <path d="M250 100 L320 40 L390 100" fill="none" stroke="#1A1A1A" stroke-width="4"/>
    <line x1="250" y1="100" x2="390" y2="100" stroke="#1A1A1A" stroke-width="4"/>
    <line x1="290" y1="72" x2="308" y2="55" stroke="#9E2A2B" stroke-width="2" marker-end="url(#a2)"/>
    <text x="320" y="128" text-anchor="middle" font-size="13" font-weight="700" fill="#1A1A1A">Boxed eave (A-frame)</text>
    <text x="320" y="146" text-anchor="middle" font-size="11" fill="#555">panels run side-to-side</text>
    <text x="320" y="162" text-anchor="middle" font-size="11" fill="#555">peaked — mid-tier look</text>
  </g>
  <g>
    <path d="M480 100 L550 40 L620 100" fill="none" stroke="#9E2A2B" stroke-width="5"/>
    <line x1="480" y1="100" x2="620" y2="100" stroke="#1A1A1A" stroke-width="4"/>
    <line x1="560" y1="45" x2="560" y2="88" stroke="#1A1A1A" stroke-width="2.5" marker-end="url(#a1)" stroke-dasharray="4 3"/>
    <text x="550" y="128" text-anchor="middle" font-size="13" font-weight="700" fill="#9E2A2B">Vertical (default)</text>
    <text x="550" y="146" text-anchor="middle" font-size="11" fill="#555">panels run top-to-bottom</text>
    <text x="550" y="162" text-anchor="middle" font-size="11" fill="#555">rain &amp; snow slide off — lasts longer</text>
  </g>
  <defs>
    <marker id="a1" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#1A1A1A"/></marker>
    <marker id="a2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#9E2A2B"/></marker>
  </defs>
</svg>
<div class="diagram-cap">Arrows show which way the roof panels run. Pitch it as: "Rain and snow slide straight off. It lasts longer, and it's what we recommend."</div>
</figure>
<h3>Steel specs — lower gauge number means thicker steel</h3>
<figure>
<svg class="diagram" viewBox="0 0 640 150" xmlns="http://www.w3.org/2000/svg">
  <rect x="30"  y="20" width="26" height="22" fill="#9E2A2B"/><text x="43"  y="58" text-anchor="middle" font-size="12" font-weight="700" fill="#1A1A1A">12ga</text><text x="43" y="74" text-anchor="middle" font-size="10" fill="#555">framing upgrade</text>
  <rect x="130" y="20" width="20" height="22" fill="#1A1A1A"/><text x="140" y="58" text-anchor="middle" font-size="12" font-weight="700" fill="#1A1A1A">14ga</text><text x="140" y="74" text-anchor="middle" font-size="10" fill="#555">framing standard</text>
  <rect x="230" y="20" width="12" height="22" fill="#9E2A2B"/><text x="236" y="58" text-anchor="middle" font-size="12" font-weight="700" fill="#1A1A1A">26ga</text><text x="236" y="74" text-anchor="middle" font-size="10" fill="#555">panel upgrade</text>
  <rect x="330" y="20" width="10" height="22" fill="#1A1A1A"/><text x="335" y="58" text-anchor="middle" font-size="12" font-weight="700" fill="#1A1A1A">28ga</text><text x="335" y="74" text-anchor="middle" font-size="10" fill="#555">Prime standard</text>
  <rect x="430" y="20" width="8"  height="22" fill="#9E2A2B"/><text x="434" y="58" text-anchor="middle" font-size="12" font-weight="700" fill="#1A1A1A">29ga</text><text x="434" y="74" text-anchor="middle" font-size="10" fill="#555">panel standard</text>
  <text x="320" y="112" text-anchor="middle" font-size="12" fill="#555">framing: 14-gauge standard · 12-gauge upgrade for wide spans, snow country, heavy use</text>
  <text x="320" y="130" text-anchor="middle" font-size="12" fill="#555">panels: 29-gauge standard · Prime is 28-gauge · 26-gauge upgrade everywhere</text>
</svg>
<div class="diagram-cap">Thickness to scale — 12-gauge is roughly 3× the steel of 29-gauge.</div>
</figure>
<ul>
<li><b>Prime line (MI, WI, MN):</b> framing is galvanized inside and out — say "double-galvanized" only for those states.</li>
<li><b>Overhang:</b> 6 inches standard, 1-foot upgrade available.</li>
</ul>
<h3>Snow and wind load — your best angle in the north</h3>
<ul>
<li>Every building is <b>engineered and certified to the wind and snow load for its exact address</b> — that's why the install ZIP matters before you quote.</li>
<li>Buildings can be engineered up to <b>90 PSF snow load</b>. That's the lead angle in Michigan, Wisconsin, and Minnesota.</li>
</ul>
${SAY('"It\'s engineered for your area\'s snow and wind, and that\'s already in the price."')}
<div class="callout amber"><b>"Certified" means built-to-spec — it is not a warranty.</b> Don't promise more than that.</div>
` },
    { id: "c2l3", type: "lesson", title: "Install, Lead Time, Permits & Payment", minutes: 10, body: `
<h3>Installation and lead time</h3>
<ul>
<li>Delivery and installation are <b>included</b>. The crew anchors to concrete, gravel, dirt, or asphalt.</li>
<li>The customer provides a level site.</li>
<li>Customer wording: <b>"usually a few weeks from order."</b> Internal reality: about 4–8 weeks depending on line and region (check the Lead Time Map). Never promise a date.</li>
<li>Wide buildings (over 30 ft): Prime requires 50% of the building price before manufacturing, offset by the deposit. Other lines: check with Shane before quoting.</li>
</ul>
<h3>Permits and drawings</h3>
<ul>
<li>Never say yes or no on a permit. Send the customer to their county building department.</li>
<li><b>Generic engineered drawings come with the building</b> — engineer-stamped and suitable for permit submittal.</li>
<li>Sealed or site-specific drawings can cost extra (typically only needed on commercial builds); some lines can pull the permit for a fee. Confirm current fees with Shane before quoting any drawing or permit fee.</li>
</ul>
<h3>How the customer pays — three steps</h3>
<figure>
<svg class="diagram" viewBox="0 0 640 120" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="25" width="180" height="62" rx="10" fill="#9E2A2B"/>
  <text x="110" y="50" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">1 · DEPOSIT AT ORDER</text>
  <text x="110" y="70" text-anchor="middle" fill="#F2DCDC" font-size="10.5">locks today's price + spot in queue</text>
  <rect x="230" y="25" width="180" height="62" rx="10" fill="#fff" stroke="#1A1A1A" stroke-width="1.5"/>
  <text x="320" y="50" text-anchor="middle" font-size="13" font-weight="700" fill="#1A1A1A">2 · BUILD &amp; SCHEDULE</text>
  <text x="320" y="70" text-anchor="middle" font-size="10.5" fill="#555">nothing else owed meanwhile</text>
  <rect x="440" y="25" width="180" height="62" rx="10" fill="#fff" stroke="#1A1A1A" stroke-width="1.5"/>
  <text x="530" y="50" text-anchor="middle" font-size="13" font-weight="700" fill="#1A1A1A">3 · BALANCE AT INSTALL</text>
  <text x="530" y="70" text-anchor="middle" font-size="10.5" fill="#555">"Due Upon Installation" or financed</text>
  <line x1="200" y1="56" x2="228" y2="56" stroke="#1A1A1A" stroke-width="2.5" marker-end="url(#a3)"/>
  <line x1="410" y1="56" x2="438" y2="56" stroke="#1A1A1A" stroke-width="2.5" marker-end="url(#a3)"/>
  <defs><marker id="a3" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#1A1A1A"/></marker></defs>
</svg>
<div class="diagram-cap">The sales line: "You lock today's price with just a deposit. The rest isn't due until we show up to install."</div>
</figure>
<div class="callout">Target installs within <b>3 months</b> of order. If a buyer wants to pay now but install later than that, bring it to Shane first.</div>
` },
    { id: "c2v1", type: "video", title: "Video: A Real 40×60 Shop Build — the Buyer's Perspective", video: "build4060", minutes: 20, why: "Watch for the decisions and regrets a real buyer runs into — these are the questions our customers should be asking us. Both videos in this course are from a homeowner's own build, so reps watch them to learn the parts, the sequence, and the buyer's point of view — not as a picture of our install process." },
    { id: "c2v2", type: "video", title: "Video: Step-by-Step — How a Metal Building Goes Up", video: "buildStep", minutes: 30, why: "Watch each component go up in order, from site prep to the finished building. After this video you should be able to name the build steps in order and point out at least five components from the anatomy lesson." },
    { id: "c2q", type: "quiz", title: "Course 2 Quiz", questions: [
      { q: "Default roof style we recommend?", choices: ["Regular", "Boxed eave", "Vertical"], a: 2, why: "Vertical: rain and snow slide straight off; it lasts longer." },
      { q: "Why recommend vertical in snow country?", choices: ["It's the cheapest", "Panels run top-to-bottom so rain and snow slide off", "It's the only style we sell"], a: 1, why: "Vertical panels run top-to-bottom — precipitation slides straight off." },
      { q: "Which is thicker steel?", choices: ["29-gauge", "26-gauge", "They're the same"], a: 1, why: "Lower gauge number = thicker steel." },
      { q: "Standard framing gauge, and the upgrade?", choices: ["14-gauge standard, 12-gauge upgrade", "12-gauge standard, 14-gauge upgrade", "29-gauge standard, 26-gauge upgrade"], a: 0, why: "14-gauge framing is standard; 12-gauge for wide spans, snow country, heavy use." },
      { q: "Why confirm the exact install ZIP before quoting?", choices: ["For shipping addresses only", "It sets the snow/wind certification, lead time, and which line to quote", "It doesn't matter"], a: 1, why: "The install ZIP (not the mailing address) drives certification, lead time, and line selection." },
      { q: "Max snow load we can engineer to?", choices: ["40 PSF", "65 PSF", "90 PSF"], a: 2, why: "Up to 90 PSF — the lead angle in MI, WI, MN." },
      { q: "A customer asks when it will be installed. You say…", choices: ["\"It'll be up in 3 weeks.\"", "\"Usually a few weeks from order — scheduling calls you to set the date.\"", "\"Whenever you want.\""], a: 1, why: "Never promise a date. Internal reality is 4–8 weeks; the customer hears 'a few weeks from order.'" },
      { q: "What do engineered drawings do for the customer?", choices: ["Nothing — they're internal only", "They come with the building and are suitable for permit submittal", "They cost extra on every job"], a: 1, why: "Generic engineer-stamped drawings come with the building and work for plan review." },
      { q: "When is the balance due?", choices: ["At order", "Halfway through manufacturing", "At install — 'Due Upon Installation' — or financed"], a: 2, why: "Deposit at order locks price and spot; balance due at install or financed (e.g., EZ Pay)." },
      { q: "A buyer wants to pay the full balance now but install in 5 months. You…", choices: ["Take the money happily", "Bring it to Shane first", "Refuse the sale"], a: 1, why: "Target installs are within 3 months of order — anything later goes to Shane." }
    ] }
  ]
},

/* ---------------------------------------------------------- 3 */
{
  id: "c3", num: 3,
  title: "Leads & the GHL Pipeline",
  desc: "Where leads come from, the pipeline stages, speed-to-lead standards, tags, and notes.",
  lessons: [
    { id: "c3l1", type: "lesson", title: "Where Leads Come From & Speed-to-Lead", minutes: 10, body: `
<p>Speed and persistence decide most deals. Call new leads within minutes, make 2–3 real call attempts on every lead, and never let a customer's call or message go unanswered. Automations run in the background — they support you; they don't replace you.</p>
<h3>Sources</h3>
<ul>
<li><b>Meta lead forms</b> (Facebook and Instagram) — the main source. Most arrive in the evening and overnight.</li>
<li><b>Website quote form</b> on ironridgesteel.com</li>
<li><b>Messenger, inbound calls, referrals.</b> Tag referrals as <code>referral</code> right away.</li>
<li>Marketplace or "Customer"-type contacts are not paid leads and aren't on the scorecard.</li>
</ul>
<h3>Call standards — measured from GHL logs</h3>
<ul>
<li><b>Daytime leads: first call within 5 minutes</b> during working hours.</li>
<li><b>Overnight leads: called by 9:30 AM Eastern.</b></li>
<li><b>2–3 real call attempts</b> before any lead ages out. Texts and automated emails don't count as attempts. A connected call under ~15 seconds is a voicemail, not a conversation.</li>
<li><b>Every call through the GHL app on the 980 line.</b></li>
<li><b>Answer your inbound calls.</b> A missed call from your own lead is the most expensive mistake in this job. Miss one? Call back within 15 minutes.</li>
<li>Customer messages get a reply the same business day — within the hour when you're on shift. Quote-change requests come first.</li>
<li><b>Don't burn the number:</b> no rapid back-to-back redials, no dialing obviously dead numbers. Too many of those and our calls get labeled "Spam Likely."</li>
</ul>
` },
    { id: "c3l2", type: "lesson", title: "Pipeline Stages, Tags & Notes", minutes: 12, body: `
<p>Pipeline stages describe the <b>customer's status</b>, not what you did. Move the stage the moment a milestone happens, not at end of day — a deal in the wrong stage is invisible.</p>
<figure>
<svg class="diagram" viewBox="0 0 660 240" xmlns="http://www.w3.org/2000/svg" font-size="10.5">
  <g>
  <rect x="8" y="14" width="96" height="40" rx="8" fill="#9E2A2B"/><text x="56" y="32" text-anchor="middle" fill="#fff" font-weight="700">New Lead</text><text x="56" y="45" text-anchor="middle" fill="#F2DCDC">automations on</text>
  <rect x="120" y="14" width="96" height="40" rx="8" fill="#fff" stroke="#1A1A1A"/><text x="168" y="32" text-anchor="middle" font-weight="700">Contacted</text><text x="168" y="45" text-anchor="middle" fill="#555">replied w/ details</text>
  <rect x="232" y="14" width="96" height="40" rx="8" fill="#fff" stroke="#1A1A1A"/><text x="280" y="32" text-anchor="middle" font-weight="700">Quote Sent</text><text x="280" y="45" text-anchor="middle" fill="#555">quote delivered</text>
  <rect x="344" y="14" width="112" height="40" rx="8" fill="#fff" stroke="#1A1A1A"/><text x="400" y="32" text-anchor="middle" font-weight="700">Active Prospect</text><text x="400" y="45" text-anchor="middle" fill="#555">reviewing quote</text>
  <rect x="472" y="14" width="118" height="40" rx="8" fill="#fff" stroke="#1A1A1A"/><text x="531" y="32" text-anchor="middle" font-weight="700">Decision Pending</text><text x="531" y="45" text-anchor="middle" fill="#555">comparing / spouse</text>
  <rect x="606" y="14" width="0" height="40"/>
  <line x1="104" y1="34" x2="118" y2="34" stroke="#1A1A1A" stroke-width="2" marker-end="url(#p1)"/>
  <line x1="216" y1="34" x2="230" y2="34" stroke="#1A1A1A" stroke-width="2" marker-end="url(#p1)"/>
  <line x1="328" y1="34" x2="342" y2="34" stroke="#1A1A1A" stroke-width="2" marker-end="url(#p1)"/>
  <line x1="456" y1="34" x2="470" y2="34" stroke="#1A1A1A" stroke-width="2" marker-end="url(#p1)"/>
  </g>
  <g>
  <rect x="8" y="76" width="118" height="40" rx="8" fill="#fff" stroke="#1A1A1A"/><text x="67" y="94" text-anchor="middle" font-weight="700">Deposit Requested</text><text x="67" y="107" text-anchor="middle" fill="#555">follow up daily</text>
  <rect x="140" y="76" width="118" height="40" rx="8" fill="#fff" stroke="#1A1A1A"/><text x="199" y="94" text-anchor="middle" font-weight="700">Order In Progress</text><text x="199" y="107" text-anchor="middle" fill="#555">hand off to Shane</text>
  <rect x="272" y="76" width="96" height="40" rx="8" fill="#2E7D4F"/><text x="320" y="94" text-anchor="middle" fill="#fff" font-weight="700">Closed Won</text><text x="320" y="107" text-anchor="middle" fill="#D8EBDF">sale complete</text>
  <rect x="382" y="76" width="90" height="40" rx="8" fill="#fff" stroke="#1A1A1A" stroke-dasharray="5 4"/><text x="427" y="94" text-anchor="middle" font-weight="700">Nurture</text><text x="427" y="107" text-anchor="middle" fill="#555">not now, not dead</text>
  <rect x="486" y="76" width="96" height="40" rx="8" fill="#fff" stroke="#1A1A1A" stroke-dasharray="5 4"/><text x="534" y="94" text-anchor="middle" font-weight="700">Closed Lost</text><text x="534" y="107" text-anchor="middle" fill="#555">aged out / firm no</text>
  <line x1="531" y1="54" x2="531" y2="74" stroke="#1A1A1A" stroke-width="2" marker-end="url(#p1)"/>
  <line x1="126" y1="96" x2="138" y2="96" stroke="#1A1A1A" stroke-width="2" marker-end="url(#p1)"/>
  <line x1="258" y1="96" x2="270" y2="96" stroke="#1A1A1A" stroke-width="2" marker-end="url(#p1)"/>
  </g>
  <text x="8" y="150" fill="#555">Your job per stage: New Lead → call 2–3× over the first days (no reply in ~7–10 days auto-moves to Closed Lost) · Quote Sent → run the follow-up cadence · Active Prospect → answer questions, trial-close · Decision Pending → pin a specific next step and date · Order In Progress → every build detail in GHL, then tag Shane.</text>
  <defs><marker id="p1" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#1A1A1A"/></marker></defs>
</svg>
<div class="diagram-cap">Pipeline v2 — stages describe the customer's status, not the rep's activity.</div>
</figure>
<h3>Tags</h3>
<table>
<tr><th>Tag</th><th>Use when</th></tr>
<tr><td>hot</td><td>Ready to move soon (often a cash buyer)</td></tr>
<tr><td>financing</td><td>Asks about monthly payments</td></tr>
<tr><td>comparing quotes</td><td>Shopping other dealers</td></tr>
<tr><td>price sensitive</td><td>Price keeps coming up</td></tr>
<tr><td>on hold</td><td>Waiting on a permit, land, HOA, or concrete</td></tr>
<tr><td>call only</td><td>Ignores texts, answers calls</td></tr>
<tr><td>referral / repeat customer</td><td>Source tags</td></tr>
<tr><td>follow-up / high priority</td><td>Needs a scheduled callback or urgent attention</td></tr>
</table>
<h3>Notes — log one after every real conversation</h3>
<p>Date, what they want, what's blocking them, and the next step with a date.</p>
<div class="callout green"><b>Good:</b> "10/6, 12 min. 30x40x12 vertical garage, Eau Claire WI, on gravel. Comparing one other quote. Wife decides with him. Quote sent today; call Thu 10/9 at 6 PM."</div>
<div class="callout"><b>Bad:</b> "Called. Wants quote." — that note helps nobody, including you in three days.</div>
` },
    { id: "c3v0", type: "video", title: "Video: GHL Conversations Overview & the AI Lead Flow", video: "ghlConversations", minutes: 8, why: "Get oriented in the Conversations view — where every text, email, and call lives — and watch how the AI lead flow texts and emails a new lead automatically before you ever touch it. The automations support you; they don't replace you." },
    { id: "c3v2", type: "video", title: "Video: Managing Pipeline Stages and Automations", video: "ghlPipelineStages", minutes: 10, why: "Watch Shane move deals through the stages and show what the automations fire on. The lesson text taught you what each stage means — this is what working them actually looks like." },
    { id: "c3v3", type: "video", title: "Video: Sales Pipeline Stages and Quote Details", video: "ghlQuoteDetails", minutes: 10, why: "How the quote details ride along with the deal as it moves stage to stage — and why a deal in the wrong stage with missing details is invisible to everyone, including Shane." },
    { id: "c3v1", type: "video", title: "Video: Calling & Following Up with Prospects", video: "ghlWalkthrough", minutes: 12, why: "Watch Shane call and follow up with real prospects in GHL. Copy the rhythm: call first, note it, set the stage, tag it, and set the next step. This is the daily working pattern the scorecard measures." },
    { id: "c3q", type: "quiz", title: "Course 3 Quiz", questions: [
      { q: "Daytime leads get a first call within…", choices: ["5 minutes during working hours", "1 hour", "By end of day"], a: 0, why: "Reps get phone notifications on new leads — 5 minutes is the standard." },
      { q: "Overnight leads must be called by…", choices: ["Noon", "9:30 AM Eastern", "The next evening"], a: 1, why: "Overnight leads are called by 9:30 AM Eastern." },
      { q: "A connected call that lasts 10 seconds is…", choices: ["A real attempt", "A voicemail, not a conversation", "A closed deal"], a: 1, why: "Under ~15 seconds connected = voicemail." },
      { q: "How many real call attempts before a lead can age out?", choices: ["1", "2–3, dialed through GHL", "7"], a: 1, why: "2–3 real attempts; texts and automated emails don't count." },
      { q: "You miss a call from your own lead. You call back within…", choices: ["15 minutes", "An hour", "Tomorrow"], a: 0, why: "Missed inbound = call back within 15 minutes. It's the most expensive mistake in the job." },
      { q: "Pipeline stages describe…", choices: ["What the rep did today", "The customer's status", "The ad campaign that produced the lead"], a: 1, why: "Stages describe the customer's status. Move them the moment a milestone happens." },
      { q: "A customer replies with build details. The stage moves to…", choices: ["Active Prospect", "Contacted (often straight to Quote Sent once quoted)", "Nurture"], a: 1, why: "Contacted = replied with details. Many skip straight to Quote Sent once the quote goes out." },
      { q: "A customer says they'll buy next spring. You…", choices: ["Mark Closed Lost", "Move to Nurture and log the date", "Delete the lead"], a: 1, why: "Nurture is not dead — re-contact at 3 months, 6 months, and 1 year, or sooner if they gave a date." },
      { q: "\"comparing quotes\" tag means…", choices: ["The customer is shopping other dealers", "You compared two lines in Sensei", "The quote expired"], a: 0, why: "Tag it when the customer is shopping other dealers — it changes your follow-up approach." }
    ] }
  ]
},

/* ---------------------------------------------------------- 4 */
{
  id: "c4", num: 4,
  title: "Discovery & the First Call",
  desc: "The opener, the 10 discovery questions, the call flow, and what to do after a missed call.",
  lessons: [
    { id: "c4l1", type: "lesson", title: "The Opener & Permission", minutes: 8, body: `
<p>The first call has one job: get everything you need for an accurate quote, plus the reason behind the purchase — then send the quote while they're still on the phone, or within the hour. <b>Listen more than you talk.</b></p>
${SAY('Hey [Name], this is [Rep] with IronRidge. You were just looking at one of our buildings, so I wanted to grab a couple of details and get you a real price, not a ballpark. Got two minutes?')}
<ul>
<li>If it's a bad time, book a <b>specific</b> callback: "6:00 or 7:00 tonight?" Don't settle for "call me later."</li>
<li>The permission question ("got two minutes?") gets a yes — the second yes (the quote) comes easier.</li>
</ul>
<h3>After a missed first call</h3>
${SAY('<b>Voicemail (under 20 seconds):</b> "Hi [Name], [Rep] with IronRidge about the building you asked about. I\'ve got a couple of quick questions so I can get you a real price. Call or text me back at 980-550-5660."')}
${SAY('<b>Text right after:</b> "Hi [Name], it\'s [Rep] at IronRidge. Just tried you about your building quote. What size are you thinking, and where\'s it going?"')}
` },
    { id: "c4l2", type: "lesson", title: "The 10 Discovery Questions — In Order", minutes: 12, body: `
<p>Ask them in this order. Write down the customer's <b>exact words</b> about what the building is for — you'll repeat them back when you close.</p>
<ol>
<li><b>What's it for?</b> What will you store or do in it? Sets the size, and tells you <i>why</i> they're buying.</li>
<li><b>Size:</b> do you have dimensions in mind, or want me to recommend? If they give width and length only, ask about height — or recommend one (9–10 ft side height suits a 2-car garage).</li>
<li><b>Enclosure:</b> fully enclosed, open, or a mix?</li>
<li><b>Doors and windows:</b> roll-up doors (how many, what size), walk-in door, windows?</li>
<li><b>Location:</b> confirm the install ZIP and county. This sets snow/wind load, lead time, and which line to quote.</li>
<li><b>Surface:</b> concrete, dirt, gravel, or asphalt? Is the site level?</li>
<li><b>Timeline:</b> when do you want it standing?</li>
<li><b>Decision:</b> is anyone else involved in the decision?</li>
<li><b>Budget and payment:</b> paying cash, or would monthly payments help?</li>
<li><b>Shopping:</b> have you gotten other quotes? What did they include?</li>
</ol>
<div class="callout green"><b>Discovery psychology (the call beneath the call):</b> dream → problem → history → now → path. People don't buy a 30×40; they buy what it does for them — a storage bill that ends, a truck out of the weather, a shop for the business. Ask until you find the reason, then quote to that reason.</div>
<h3>The five buying motivations you'll hear</h3>
<div class="type-cards">
<div class="type-card"><h4>Storage fees</h4><p>Paying monthly for a storage unit — the building pays for itself.</p></div>
<div class="type-card"><h4>Vehicle parking</h4><p>Car, truck, RV, boat, trailer — protection from weather.</p></div>
<div class="type-card"><h4>Business shop</h4><p>Workspace for a trade or side business.</p></div>
<div class="type-card"><h4>Toys / mancave</h4><p>Toys, hobbies, a place of one's own.</p></div>
<div class="type-card"><h4>Agricultural</h4><p>Equipment, feed, livestock, hay.</p></div>
</div>
<h3>Site prep — it doesn't have to be ready to order</h3>
<p>The site needn't be ready today. <b>The build queue IS the concrete window</b> — open builds live on gravel while customers pour pads. Concrete coordination is IronRidge's job; use it to defuse "I'm not ready yet."</p>
` },
    { id: "c4l3", type: "lesson", title: "The Call Flow", minutes: 8, body: `
<ol>
<li><b>Opener and permission</b> (30 seconds)</li>
<li><b>Discovery questions 1–10</b> (5–10 minutes)</li>
<li><b>Recommend the build:</b> "Based on what you told me, here's what I'd do…" — vertical roof, right-sized, upgrades only where they matter</li>
<li><b>Build the quote in Sensei.</b> Stay on the line, or set a callback within the hour.</li>
<li><b>Walk them through the quote</b>, then trial-close: "How's that looking for what you need?"</li>
<li><b>Set a specific next step:</b> deposit now, or a callback day and time.</li>
</ol>
<div class="callout"><b>The removal question:</b> before you hang up, ask — <i>"If the quote is exactly right, any reason you wouldn't move forward today?"</i> Whatever they answer is the real objection. Now you can handle it instead of discovering it on day six.</div>
<h3>Recommending the build</h3>
<p>Lead with what they told you: "You said the tractor needs a home and the snow piles up by February — so I'd go 30 wide, 12 tall legs, vertical roof, certified for your county's snow load. Here's what that looks like…"</p>
` },
    { id: "c4q", type: "quiz", title: "Course 4 Quiz", questions: [
      { q: "The first call's ONE job is to…", choices: ["Close the sale", "Get everything needed for an accurate quote plus the reason behind the purchase", "Send the automated price list"], a: 1, why: "Then send the quote while they're still on the phone or within the hour." },
      { q: "A customer says \"now's not a good time.\" You…", choices: ["Say you'll try again sometime", "Book a specific callback — \"6:00 or 7:00 tonight?\"", "Keep talking anyway"], a: 1, why: "Never settle for 'call me later' — pin a specific time." },
      { q: "The customer gives you 30×40 but no height. You…", choices: ["Quote 30×40 with standard legs and hope", "Ask about height, or recommend one (9–10 ft suits a 2-car garage)", "Skip height — it doesn't matter"], a: 1, why: "Height changes the price and the fit. Ask or recommend." },
      { q: "Why ask \"what's it for?\" first?", choices: ["Small talk", "It sets the size and tells you why they're buying — you'll repeat their words back at the close", "It's required by the CRM"], a: 1, why: "The reason behind the purchase drives the recommendation and the close." },
      { q: "Question 5 (location) matters because…", choices: ["Mailing address for paperwork", "The install ZIP and county set snow/wind certification, lead time, and which line to quote", "We only sell in three states"], a: 1, why: "Confirm the actual install ZIP, not the mailing address." },
      { q: "The trial-close sounds like…", choices: ["\"So are you ready to buy?\"", "\"How's that looking for what you need?\"", "\"What's your budget?\""], a: 1, why: "Soft trial-close after walking through the quote." },
      { q: "The removal question is…", choices: ["\"Are you the homeowner?\"", "\"If the quote is exactly right, any reason you wouldn't move forward today?\"", "\"What's your credit score?\""], a: 1, why: "It surfaces the real objection now, on the phone, while you can handle it." },
      { q: "A customer says \"my site isn't ready, I can't order yet.\" You…", choices: ["Agree and close the file", "Explain the build queue IS the concrete window — open builds live on gravel while the pad gets poured", "Tell them to pour concrete first and call back in a year"], a: 1, why: "The site needn't be ready to order — and concrete coordination is IronRidge's job." }
    ] }
  ]
},

/* ---------------------------------------------------------- 5 */
{
  id: "c5", num: 5,
  title: "Quoting in Sensei",
  desc: "Picking the line, building the quote, the QA checklist, and practice scenarios.",
  lessons: [
    { id: "c5l1", type: "lesson", title: "Picking the Line to Quote", minutes: 10, body: `
<p>Every price a customer sees comes from <b>Sensei</b>. Never quote from memory, a napkin, or last week's deal. Five steps to pick the line:</p>
<ol>
<li><b>Coverage:</b> which lines serve the customer's state? Check the <b>Shop Locator</b> (enter the ZIP to see the closest shop per line).</li>
<li><b>Lead time:</b> if the customer's date is tight, check the <b>Lead Time Map</b> and favor the faster line.</li>
<li><b>Fit:</b> Michigan, Wisconsin, Minnesota, and big northern snow-load buildings go to <b>Prime</b> (28-gauge, double-galvanized, high snow load).</li>
<li><b>Price:</b> if two lines fit, quote the more competitive one. If a customer is comparing quotes, <b>switching lines is your first price lever — before any discount.</b></li>
<li><b>Not sure?</b> Ask Shane. Don't guess on a big or wide building.</li>
</ol>
<div class="callout"><b>Manufacturer lines are rep-only knowledge.</b> You use them to pick who to quote. To the customer, IronRidge shops its manufacturing team to get them the best building at the best price.</div>
` },
    { id: "c5l2", type: "lesson", title: "Building the Quote (11 Steps)", minutes: 12, body: `
<ol>
<li>Log in to Sensei and pick the line.</li>
<li>Building type and roof style (default: <b>vertical</b>).</li>
<li>Width, length, and height.</li>
<li>Framing gauge (14 standard, 12 upgrade) and panel gauge.</li>
<li>Sides and ends: open, enclosed, or partial; panel orientation.</li>
<li>Doors, windows, and walk-ins (sizes and placement).</li>
<li>Colors (roof, walls, trim) — use the color sheet for that line.</li>
<li>Install ZIP, so the right snow and wind certification applies.</li>
<li>Surface and anchors to match the site.</li>
<li>Review the total, the <b>Downpayment</b>, and <b>Due Upon Installation</b>.</li>
<li>Send it to the customer, then attach the quote to the GHL opportunity and add a note.</li>
</ol>
<h3>Quote QA checklist — before EVERY send</h3>
<ul class="checklist">
<li>Customer name, phone, and email correct</li>
<li>Install ZIP is the <b>actual site</b>, not the mailing address</li>
<li>Size matches what the customer said, including height</li>
<li>Roof style is vertical — or the customer chose otherwise and you noted why</li>
<li>Doors and windows match the conversation</li>
<li>Surface and anchors match the site</li>
<li>Certification and snow load look right for the state</li>
<li>Nothing in the customer-facing PDF needs fixing before it goes</li>
<li>Quote attached in GHL, stage set to <b>Quote Sent</b>, follow-up date in the note</li>
</ul>
<h3>Practice scenarios (your trainer will run these live too)</h3>
<ol>
<li>20×21×9 two-car carport, open, on concrete, Charlotte NC 28205</li>
<li>30×40×12 enclosed garage, two 10×10 roll-ups, walk-in door, gravel, Eau Claire WI 54701</li>
<li>24×30×10 combo unit (12 ft open, 18 ft enclosed), dirt, Tyler TX 75701</li>
<li>40×60×14 shop, two 12×12 roll-ups, two walk-ins, four windows, concrete, Grand Rapids MI 49503</li>
<li>18×36×14 RV cover, three sides enclosed, gravel, Knoxville TN 37918</li>
</ol>
<div class="callout green"><b>Gate 2 (live, with your trainer):</b> build three of these scenarios alone, each passing every QA item. That's the solo-quote gate from the onboarding plan.</div>
` },
    { id: "c5v1", type: "video", title: "Video: Building 3D Quotes in Sensei 2.0", video: "senseiWalkthrough", minutes: 12, why: "Watch Shane build a quote in Sensei 2.0: line selection, dimensions, roof style, install ZIP, surface — the same steps from the lesson above, on a real build. Pause and mimic each step in your own Sensei login if you have it already." },
    { id: "c5v3", type: "video", title: "Video: Walk-In Doors, Windows, Colors & Insulation", video: "senseiOptions", minutes: 10, why: "The configuration details that make a quote match the customer's conversation: walk-in doors, windows, colors, insulation options. These are the items the QA checklist catches when they don't match." },
    { id: "c5v4", type: "video", title: "Video: Sending and Editing Construction Quotes", video: "senseiSending", minutes: 8, why: "Sending the quote to the customer and what to do when they want changes — edit and resend, never eyeball a revised number." },
    { id: "c5v2", type: "video", title: "Video: GHL — Quote to Order Workflow", video: "quoteAttachGhl", minutes: 10, why: "The full workflow from quote to order: sending the quote, attaching the PDF to the opportunity, writing the note (date, what they want, what's blocking, next step), moving the stage to Quote Sent — and continuing through the deposit and the handoff to Order In Progress. This ties Course 5 to Course 7." },
    { id: "c5q", type: "quiz", title: "Course 5 Quiz", questions: [
      { q: "A Michigan customer wants a 40×60 shop. Which line fits best?", choices: ["The cheapest line available in the Southeast", "Prime (28-gauge, double-galvanized, high snow load)", "Whichever has the shortest lead time, regardless of snow load"], a: 1, why: "MI/WI/MN and big northern snow-load buildings go to Prime." },
      { q: "A customer is comparing your quote against another dealer's. Your FIRST price lever is…", choices: ["A discount", "Switching lines to the more competitive quote", "Removing the door"], a: 1, why: "Switch lines before you ever touch a discount." },
      { q: "Default roof style in Sensei?", choices: ["Regular", "Boxed eave", "Vertical"], a: 2, why: "Vertical is the default; anything else gets noted why." },
      { q: "The install ZIP on the quote should be…", choices: ["The customer's mailing address", "The actual site where the building goes", "The shop's ZIP"], a: 1, why: "The site ZIP drives certification — a classic QA fail." },
      { q: "Before the quote goes out, you check…", choices: ["Nothing — Sensei is always right", "The 9-item QA checklist, then attach the quote in GHL, set Quote Sent, and note the follow-up date", "Only the price"], a: 1, why: "Every quote passes the QA checklist before it's sent." },
      { q: "You're not sure which line to quote on a 42-wide building. You…", choices: ["Guess", "Quote the one you used last week", "Ask Shane"], a: 2, why: "Don't guess on big or wide buildings." },
      { q: "Where does the customer's deposit amount show?", choices: ["You calculate 20% in your head", "On the Sensei quote as 'Downpayment'", "Shane texts it later"], a: 1, why: "The quote is the source of truth — never quote a fixed percentage." }
    ] }
  ]
},

/* ---------------------------------------------------------- 6 */
{
  id: "c6", num: 6,
  title: "Follow-up, Objections & Financing",
  desc: "The follow-up cadence, diagnosing the six objections, and EZ Pay / HFS financing.",
  lessons: [
    { id: "c6l1", type: "lesson", title: "The Follow-up Cadence", minutes: 8, body: `
<p>Most deals close on the <b>second to fourth conversation</b>, not the first. The follow-up is the job. GHL automations send their own messages alongside this — your calls are on top of the automations, not instead of them.</p>
<table>
<tr><th>When</th><th>Channel</th><th>Goal</th></tr>
<tr><td>Same day</td><td>Call, then text if no answer</td><td>Walk through the quote while it's fresh</td></tr>
<tr><td>Day 1–2</td><td>Text</td><td>"Did you get a chance to look it over? Any changes?"</td></tr>
<tr><td>Day 3–4</td><td>Call</td><td>Answer questions live, trial-close</td></tr>
<tr><td>Day 5–7</td><td>Call, then text</td><td>Surface the real objection; set a decision date</td></tr>
<tr><td>Day 8–10</td><td>Final call and text</td><td>"Should I keep this price held, or close your file for now?"</td></tr>
<tr><td>After that</td><td>Nurture</td><td>Re-contact at 3 months, 6 months, 1 year — or sooner if they gave a date</td></tr>
</table>
<div class="callout">The day 8–10 question ("keep the price held or close your file?") is not a bluff — it forces a decision and it's the last soft touch before Nurture.</div>
` },
    { id: "c6l2", type: "lesson", title: "The Six Objections — Diagnose Before You Answer", minutes: 15, body: `
<p>Every objection gets <b>diagnosed</b> before it gets answered. Ask what's behind it. Discounts come last.</p>
<table>
<tr><th>They say</th><th>What's usually behind it</th><th>The play</th></tr>
<tr><td>"Just send me the info"</td><td>A polite brush-off</td><td>Ask what it must get right, isolate other blockers, send it, lock a callback time</td></tr>
<tr><td>"Your quote is $X more"</td><td>Not the same building</td><td>Compare spec for spec, get a "yes if we get there," check with the manager, switch lines before discounting</td></tr>
<tr><td>"Let me talk to my spouse"</td><td>Real decision-maker — or a soft no</td><td>"If she says no, what would that mean for you?" Then close now, or offer a three-way call and a set follow-up</td></tr>
<tr><td>"It's too expensive"</td><td>Value, size, return, or cash timing</td><td>Ask which one; stack the spec, right-size it, reframe the return, or offer EZ Pay</td></tr>
<tr><td>"I'm not in a rush"</td><td>No urgency</td><td>The deposit locks today's price and their place in line without rushing the project</td></tr>
<tr><td>"I need it sooner"</td><td>Timeline</td><td>The clock starts at order. Quote the fastest line. Never promise a date</td></tr>
</table>
<h3>Two questions that aren't objections</h3>
${SAY('<b>"Who makes the buildings?"</b> — "We shop multiple manufacturers to get you the best building at the best price. You\'re buying from IronRidge, and we handle everything start to finish."')}
${SAY('<b>"Do I need a permit?"</b> — "That\'s set by your county, and it varies a lot. Your building department can tell you exactly. Generic engineered drawings come with the building."')}
<h3>The order of levers on a price objection</h3>
<p><b>Diagnose → value-stack → switch lines → EZ Pay → discount</b> (last, and only with approval).</p>
` },
    { id: "c6l3", type: "lesson", title: "Financing: EZ Pay & HFS", minutes: 8, body: `
<table>
<tr><th>Option</th><th>Credit check?</th><th>Best for</th><th>How</th></tr>
<tr><td><b>EZ Pay</b> (rent-to-own, primary)</td><td>No</td><td>Anyone who mentions monthly payments, budget, or credit worries</td><td>Rep runs the EZ Pay calculator during the call</td></tr>
<tr><td><b>HFS Financial</b> (traditional loan)</td><td>Yes</td><td>Good credit; wants a conventional loan</td><td>Customer applies through IronRidge's HFS link</td></tr>
</table>
<h3>EZ Pay talking points</h3>
<ul>
<li>No credit check and no hard inquiry.</li>
<li>Pay it off any time — no prepayment penalty.</li>
<li>The deposit places the order. Extra money down lowers the monthly payment.</li>
<li>It's installed now and paid over time.</li>
</ul>
<div class="callout amber"><b>EZ Pay carries interest — never call it "interest-free."</b> Say what's true: no credit check, no prepayment penalty, installed now and paid over time.</div>
` },
    { id: "c6q", type: "quiz", title: "Course 6 Quiz", questions: [
      { q: "Most deals close on the…", choices: ["First call", "Second to fourth conversation", "Tenth touch"], a: 1, why: "The follow-up is the job." },
      { q: "The FIRST thing you do with any objection is…", choices: ["Answer it", "Discount", "Diagnose what's actually behind it"], a: 2, why: "Diagnose before you answer — discounts come last." },
      { q: "\"Just send me the info\" usually means…", choices: ["They're ready to buy", "A polite brush-off", "They lost your email"], a: 1, why: "Ask what it must get right, isolate blockers, send it, lock a callback." },
      { q: "\"Your quote is $1,800 more\" — the first move is…", choices: ["Match the price", "Compare spec for spec — it's usually not the same building", "Apologize"], a: 1, why: "Compare the buildings, then use levers in order before any discount." },
      { q: "\"It's too expensive\" — you ask…", choices: ["\"Compared to what?\"", "Which one: value, size, return, or cash timing?", "Nothing — start discounting"], a: 1, why: "'Expensive' means four different things. Find out which." },
      { q: "Which financing has NO credit check?", choices: ["HFS Financial", "EZ Pay", "Both"], a: 1, why: "EZ Pay is rent-to-own with no credit check — and it DOES carry interest." },
      { q: "You may describe EZ Pay as…", choices: ["\"Interest-free\"", "\"No credit check, no prepayment penalty, installed now and paid over time\"", "\"Free money\""], a: 1, why: "EZ Pay carries interest. Never call it interest-free." },
      { q: "The order of levers on a price objection:", choices: ["Discount → diagnose → value", "Diagnose → value-stack → switch lines → EZ Pay → discount (with approval)", "EZ Pay → discount → hang up"], a: 1, why: "Discount is the last lever and needs approval." },
      { q: "\"I'm not in a rush\" — your play:", choices: ["Drop the price", "The deposit locks today's price and their spot in the build queue without rushing the project", "Close the file"], a: 1, why: "The deposit creates urgency without promising speed." }
    ] }
  ]
},

/* ---------------------------------------------------------- 7 */
{
  id: "c7", num: 7,
  title: "The Close, the Deposit & the Handoff",
  desc: "Closing the deal, collecting the deposit, the after-deposit checklist, reviews and referrals.",
  lessons: [
    { id: "c7l1", type: "lesson", title: "The Close", minutes: 10, body: `
<p>Your deal is done when two things are true: <b>the deposit has cleared</b>, and <b>every build detail Shane needs is in GHL</b>. Then it moves to Order In Progress and Shane submits the order.</p>
<ol>
<li><b>Trial-close throughout:</b> "How's that sounding so far?"</li>
<li><b>Play back their words:</b> "You said you need room for the truck and the mower, and it has to handle Wisconsin snow. This does both."</li>
<li><b>Assumptive close:</b> "The way this works, a deposit locks your price and your spot in the build queue, and the balance is due at install. Did you want it in [Color A] or [Color B]?"</li>
<li><b>Then stop talking.</b> Let them answer.</li>
<li>Objection? Handle it (Course 6), then <b>ask again — 2 to 3 asks is normal.</b></li>
<li>Take the deposit <b>on the call</b> when possible.</li>
</ol>
<h3>Collecting the deposit</h3>
<ul>
<li>Move the deal to <b>Deposit Requested</b> the moment you ask. This stage never sits — follow up daily until it's paid.</li>
<li>Send the deposit invoice <b>through GHL</b>. The invoice states that deposits are non-refundable — point it out so there are no surprises.</li>
<li>Never take card numbers by text or email, and never write them down.</li>
</ul>
<h3>After the deposit clears</h3>
<ul class="checklist">
<li>Confirm the payment shows as cleared in GHL</li>
<li>Order-details survey sent to the customer (automated where live; otherwise the rep sends it)</li>
<li>Every build detail in GHL: final size and options, colors, site address, surface, door placement, contact for scheduling</li>
<li>Any open question (wide-building payment, drawings, special site conditions) flagged to Shane in a note</li>
<li>Move to <b>Order In Progress</b> and tag Shane</li>
</ul>
${SAY('<b>Set expectations before you hang up:</b> "Next, our scheduling team calls you to set the install date. Lead time runs a few weeks from order. Keep the site level and clear."')}
<h3>Reviews and referrals</h3>
${SAY('"Really glad it came out the way you wanted. We\'re a growing local business and reviews make a huge difference. Would you mind leaving us a quick review on our Facebook page? I\'ll text you the link right now."')}
<p>Then: "Do you know anyone else who's been looking for a garage or carport?" — tag anyone they name as <code>referral</code>. (There's also a $100 Amex gift card incentive for customers who leave a Google or Facebook review after install — mention it before deposit, it's fulfilled after install, and paid from marketing budget.)</p>
` },
    { id: "c7v1", type: "video", title: "Screen Recording: Collecting the Deposit in GHL", video: "depositInvoice", minutes: 6, why: "Watch the deposit ask in action: stage to Deposit Requested, send the invoice through GHL, and point out where the invoice states deposits are non-refundable." },
    { id: "c7q", type: "quiz", title: "Course 7 Quiz", questions: [
      { q: "Your part of a deal is finished when…", choices: ["You hang up after the close", "The deposit has cleared AND every build detail is in GHL, moved to Order In Progress, Shane tagged", "The customer says yes"], a: 1, why: "Deposit cleared + build details in GHL + handoff. Then it's Shane's order to submit." },
      { q: "The assumptive close ends with…", choices: ["\"So... do you want it?\"", "\"Did you want it in [Color A] or [Color B]?\"", "\"I'll email you the paperwork.\""], a: 1, why: "A choice, not a yes/no — then stop talking." },
      { q: "How many times is it normal to ask for the deposit?", choices: ["Once — asking twice is pushy", "2 to 3 asks through an objection", "Until they hang up"], a: 1, why: "Handle the objection, then ask again." },
      { q: "When do you move a deal to Deposit Requested?", choices: ["When the deposit clears", "The moment you ask for the deposit", "At end of day"], a: 1, why: "Stage the moment the milestone happens — and this stage never sits." },
      { q: "Card numbers come in via…", choices: ["Text", "Email", "Never by text or email — invoice link or card by phone only"], a: 2, why: "Never take card numbers by text or email, never write them down." },
      { q: "The deposit invoice goes out…", choices: ["From your personal email", "Through GHL", "Handed to the customer at install"], a: 1, why: "GHL invoices — and you point out the non-refundable term so there are no surprises." },
      { q: "The review incentive is…", choices: ["$100 off the customer's remaining balance", "A $100 Amex gift card to the customer after install, mentioned before deposit", "$100 to the rep per review"], a: 1, why: "Gift card to the CUSTOMER, offered before deposit, fulfilled after install, from marketing budget. Never 'off the balance' — that's the manufacturer's money." },
      { q: 'Before you hang up after the deposit, you set expectations:', choices: ["You'll hear from us eventually.", "Scheduling calls to set the install date — lead time runs a few weeks from order. Keep the site level and clear.", "It'll be up next Tuesday."], a: 1, why: 'No dates promised — scheduling sets the date.' }
    ] }
  ]
},

/* ---------------------------------------------------------- 8 */
{
  id: "c8", num: 8,
  title: "Daily Rhythm, Standards & the Scorecard",
  desc: "How your day runs, the five scorecard numbers, and the 30/60/90 ramp.",
  lessons: [
    { id: "c8l1", type: "lesson", title: "The Daily Rhythm", minutes: 8, body: `
<ol>
<li><b>Start of shift (first 30 minutes):</b> clear Conversations, call every overnight lead, return missed calls.</li>
<li><b>Deposit Requested and Active Prospect:</b> call these next — closest to money.</li>
<li><b>Quote Sent follow-ups due today</b> (the Course 6 cadence).</li>
<li><b>New Lead second and third attempts.</b></li>
<li><b>All shift:</b> new leads called within 5 minutes; phone on and answered.</li>
<li><b>End of shift:</b> every conversation has a note, every stage is current, tomorrow's callbacks are set.</li>
</ol>
<p>Peak lead hours are evenings. Shift times are set per rep by Shane.</p>
<h3>The weekly scorecard — five numbers, pulled straight from GHL</h3>
<table>
<tr><th>Metric</th><th>Standard</th><th>Source</th></tr>
<tr><td>Leads Closed Lost with fewer than 2 real call attempts</td><td>0</td><td>GHL call log</td></tr>
<tr><td>Speed to first call</td><td>Daytime within 5 min; overnight by 9:30 AM ET</td><td>GHL call log</td></tr>
<tr><td>Missed inbound calls not returned within 15 minutes</td><td>0</td><td>GHL call log</td></tr>
<tr><td>Customer messages left waiting overnight</td><td>0</td><td>GHL conversations</td></tr>
<tr><td>Deposits closed</td><td>Ramp target (below)</td><td>Sensei + GHL</td></tr>
</table>
<p>A "real" call attempt is a dial through GHL. A connected call under ~15 seconds is a voicemail, not a conversation.</p>
<h3>30 / 60 / 90-day ramp</h3>
<ul>
<li><b>Day 30:</b> scorecard clean 3 weeks of 4; same-day quotes on every qualified lead.</li>
<li><b>Day 60:</b> scorecard clean every week; works Nurture reactivation unprompted.</li>
<li><b>Day 90:</b> fully independent; coaches the next new hire on one module.</li>
</ul>
<div class="callout">Two red weeks in a row means a coaching plan with your trainer. The standard is the same for everyone and comes from the logs — nobody checks pipelines by hand.</div>
` },
    { id: "c8q", type: "quiz", title: "Course 8 Quiz", questions: [
      { q: "First 30 minutes of shift:", choices: ["Coffee and email", "Clear Conversations, call every overnight lead, return missed calls", "Build quotes from yesterday"], a: 1, why: "Start of shift clears the inbox and the overnight leads." },
      { q: "Which pipeline stages do you work right after opening?", choices: ["Closed Lost", "Deposit Requested and Active Prospect — closest to money", "Nurture"], a: 1, why: "Money stages first." },
      { q: "End of shift means:", choices: ["Go home", "Every conversation has a note, every stage is current, tomorrow's callbacks set", "Log out of GHL"], a: 1, why: "End-of-day hygiene keeps the pipeline truthful." },
      { q: "The scorecard standard for missed inbound calls:", choices: ["Return within an hour", "0 not returned within 15 minutes", "3 misses allowed per week"], a: 1, why: "Zero — a missed call from your own lead is the most expensive mistake in the job." },
      { q: 'A "real" call attempt is…', choices: ["A text", "A dial through GHL (connected under ~15 sec is a voicemail, not a conversation)", "An automated email"], a: 1, why: "Texts and automations don't count — only GHL-dialed calls." },
      { q: "Two red weeks in a row means…", choices: ["Termination", "A coaching plan with your trainer", "Nothing"], a: 1, why: "Coaching first. Missing the 90-day outcome target means a review of fit." }
    ] }
  ]
},

/* ---------------------------------------------------------- 9 */
{
  id: "c9", num: 9,
  title: "Certification Exam",
  desc: "The 15 knowledge-check questions. Pass 13 of 15 to certify (Gate 1).",
  exam: true,
  lessons: [
    { id: "c9intro", type: "lesson", title: "Before You Take the Exam", minutes: 3, body: `
<p>This is <b>Gate 1</b> of certification — the same 15 knowledge-check questions a rep answers out loud, no notes, in live onboarding. Here you answer them online; your trainer may still run them verbally during your live session.</p>
<ul>
<li><b>Pass: 13 of 15.</b> You can retake the exam — it reshuffles the answer order each time.</li>
<li>No notes, no other tabs. You'd be fooling yourself, not the exam.</li>
<li>After you pass, your certificate unlocks — print it or save it as a PDF for your trainer file.</li>
</ul>
<div class="callout green">Live Gates 2 and 3 happen with your trainer: three solo Sensei quotes, the full-lifecycle role-play, and two scored live calls. This exam is the knowledge half.</div>
` },
    { id: "c9exam", type: "quiz", title: "Certification Exam (13 of 15 to pass)", exam: true, questions: [
      { q: "A customer asks who makes the buildings. What do you say?", choices: ["Name the manufacturer you plan to quote", "We shop multiple manufacturers to get the best building at the best price — you're buying from IronRidge and we handle everything start to finish", "We build them ourselves"], a: 1, why: "Transparent dealer positioning — one brand to the customer: IronRidge." },
      { q: "Do they need a permit?", choices: ["No", "Yes", "Never yes or no — their county decides; generic engineered drawings come with the building"], a: 2, why: "Send them to their building department. Never answer yes or no." },
      { q: "Default roof style, and why?", choices: ["Regular — cheapest", "Vertical — rain and snow slide straight off; it lasts longer", "Boxed eave — best curb appeal"], a: 1, why: "Vertical is the default recommendation everywhere." },
      { q: "Standard and upgrade framing gauge?", choices: ["14-gauge standard, 12-gauge upgrade", "12-gauge standard, 14-gauge upgrade", "16-gauge standard, 20-gauge upgrade"], a: 0, why: "14 standard; 12 upgrade for wide spans, snow country, heavy use." },
      { q: "Which number is thicker steel, 29 or 26?", choices: ["29", "26", "Same thickness"], a: 1, why: "Lower gauge number = thicker steel." },
      { q: "Why confirm the exact install ZIP before quoting?", choices: ["Mailing list", "It sets the snow/wind certification, lead time, and which line to quote", "Taxes"], a: 1, why: "The site ZIP drives engineering, lead time, and line choice." },
      { q: "How much snow load can we engineer to?", choices: ["40 PSF", "65 PSF", "90 PSF"], a: 2, why: "Up to 90 PSF — the snow-belt lead angle." },
      { q: "What do we tell a customer about install timing?", choices: ["A specific date we pick", "\"Usually a few weeks from order\" — scheduling sets the date; never promise one", "It depends on the weather only"], a: 1, why: "Never promise a date. The customer-facing line is 'a few weeks from order.'" },
      { q: "What does the deposit do for the customer?", choices: ["Nothing — it's just a fee", "Locks today's price and their spot in the build queue; balance is due at install", "Pays for the concrete"], a: 1, why: "That's the sales line — price lock plus queue position." },
      { q: "What's the deposit percentage?", choices: ["20%", "10%", "There isn't a fixed one — it's on the quote"], a: 2, why: "Never quote a fixed percentage. The Sensei quote shows the Downpayment." },
      { q: "Which financing has no credit check? Does it have interest?", choices: ["HFS — no interest", "EZ Pay — yes, it carries interest", "Both have credit checks"], a: 1, why: "EZ Pay: no credit check, no prepayment penalty — but it carries interest. Never call it interest-free." },
      { q: "What does \"New Lead\" mean in our pipeline?", choices: ["A fresh lead nobody has touched", "Waiting for the customer to reply while the rep calls 2–3 times and automations run", "A lead that hasn't paid yet"], a: 1, why: "Automations text and email; the rep makes real call attempts." },
      { q: "How many real call attempts before a lead can age out?", choices: ["1", "2–3, dialed through GHL", "5–6"], a: 1, why: "2–3 real attempts; texts and automated emails don't count." },
      { q: "You missed a call from your own lead. What now?", choices: ["Wait for them to call back", "Call back within 15 minutes", "Text them tomorrow"], a: 1, why: "Within 15 minutes — every time." },
      { q: "When is your part of a deal finished?", choices: ["When they say yes", "When the quote is sent", "Deposit cleared and every build detail in GHL — moved to Order In Progress, Shane tagged"], a: 2, why: "Deposit cleared + build details + handoff. That's the finish line." }
    ] }
  ]
}
];
