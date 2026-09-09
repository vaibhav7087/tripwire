export type LegKind = "flight" | "hotel" | "pickup" | "activity" | "return";
export type LegStatus = "ontime" | "delayed" | "atrisk" | "rebooked" | "cancelled";

export interface CascadeLeg {
  id: string;
  kind: LegKind;
  leg: string;
  scheduled: string;
  status: LegStatus;
  impact: string;
}

export interface RecoveryOption {
  id: string;
  title: string;
  tag: string;
  costDelta: number;
  costNote: string;
  timeSaved: string;
  confidence: number;
  reasoning: string[];
  policySource: string;
  policyCite: string;
  plan: { label: string; ref: string }[];
}

export interface Scenario {
  id: string;
  tab: string;
  flightNo: string;
  airline: string;
  route: string;
  routeDetail: string;
  date: string;
  pax: string;
  schedDep: string;
  schedArr: string;
  triggerTitle: string;
  triggerDetail: string;
  detectedAt: string;
  predictNote: string;
  cascade: CascadeLeg[];
  options: RecoveryOption[];
  resolvedNote: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "ai202",
    tab: "AI-202 · BOM → DEL",
    flightNo: "AI-202",
    airline: "Air India",
    route: "BOM → DEL",
    routeDetail: "Mumbai CSMI T2 → Delhi IGIA T3 · 2 travellers",
    date: "Tue 09 Sep 2026",
    pax: "G. Madankar + 1",
    schedDep: "18:40",
    schedArr: "20:55",
    triggerTitle: "+3h 05m delay predicted",
    triggerDetail:
      "LightGBM flags cascading ATC congestion at DEL + inbound aircraft rotation slip. Official airline notice typically follows in ~2h.",
    detectedAt: "15:32 IST",
    predictNote: "94.2% model confidence · 2.4M records benchmarked",
    cascade: [
      {
        id: "f1",
        kind: "flight",
        leg: "AI-202 · BOM → DEL",
        scheduled: "18:40 → 20:55",
        status: "delayed",
        impact: "ETA 23:58 · downstream legs slip",
      },
      {
        id: "h1",
        kind: "hotel",
        leg: "The Lalit New Delhi · Deluxe King",
        scheduled: "Check-in by 23:00",
        status: "atrisk",
        impact: "Breaches 11 PM cutoff · ₹4,500 no-show fee",
      },
      {
        id: "p1",
        kind: "pickup",
        leg: "Airport pickup · Swift Dzire",
        scheduled: "21:15 pickup",
        status: "atrisk",
        impact: "3h wait for nobody · then cancellation",
      },
      {
        id: "a1",
        kind: "activity",
        leg: "Qutub Minar sunrise tour",
        scheduled: "05:30 pickup",
        status: "atrisk",
        impact: "Starts without you · ₹1,800 non-refundable",
      },
      {
        id: "r1",
        kind: "return",
        leg: "6E-554 · DEL → BOM (12 Sep)",
        scheduled: "Held · unaffected",
        status: "ontime",
        impact: "Return leg intact · no action needed",
      },
    ],
    options: [
      {
        id: "a",
        title: "Shift night, keep the tour",
        tag: "RECOMMENDED",
        costDelta: 0,
        costNote: "₹0 delta",
        timeSaved: "~4 hrs saved",
        confidence: 96,
        reasoning: [
          "Hotel honours free date-shift inside the 24h window — arrival 23:58 still lands within policy.",
          "Pickup re-slotted to 00:15 at the same contracted rate, no surge.",
          "Tour needs only a wake-up shift to 06:30; operator confirmed slot flexibility.",
        ],
        policySource: "The Lalit booking policy",
        policyCite: "Free date-shift up to 24h before check-in · Rate plan DXK",
        plan: [
          { label: "Shift hotel to same-night late arrival", ref: "HTL-8841-SHIFT" },
          { label: "Re-slot pickup to 00:15 pickup", ref: "PKP-2204-RS" },
          { label: "Move tour pickup to 06:30", ref: "ACT-7710-RS" },
          { label: "Notify travellers + issue vouchers", ref: "NTF-0092" },
        ],
      },
      {
        id: "b",
        title: "Re-route via Jaipur, land earlier",
        tag: "FASTEST",
        costDelta: 1200,
        costNote: "+₹1,200 fare gap",
        timeSaved: "~5 hrs saved",
        confidence: 88,
        reasoning: [
          "6E-2083 via Jaipur departs 17:05 and lands DEL 21:40 — ahead of the delayed AI-202.",
          "Hotel check-in and pickup stay exactly as booked; tour untouched.",
          "AI-202 ticket converts to airline credit under delay re-accommodation.",
        ],
        policySource: "DGCA CAR, Section 3",
        policyCite: "Delays beyond 2h: alternate flight or full refund at passenger choice",
        plan: [
          { label: "Book 6E-2083 BOM-JAI-DEL", ref: "FLT-6E2083-BK" },
          { label: "Convert AI-202 to airline credit", ref: "FLT-AI202-CR" },
          { label: "Confirm hotel + pickup unchanged", ref: "HTL-8841-OK" },
        ],
      },
      {
        id: "c",
        title: "Cancel tour, bank the refund",
        tag: "CHEAPEST",
        costDelta: -1800,
        costNote: "−₹1,800 refund",
        timeSaved: "~2 hrs saved",
        confidence: 91,
        reasoning: [
          "Tour operator refunds 100% with 6h+ notice — notice window still open.",
          "Hotel and pickup shift as in option A; morning is freed for rest.",
          "Lowest outlay; best if the sunrise start is non-negotiable for no one.",
        ],
        policySource: "Tour operator T&Cs",
        policyCite: "100% refund on 6h+ advance cancellation · Booking TR-5521",
        plan: [
          { label: "Cancel sunrise tour for full refund", ref: "ACT-7710-CX" },
          { label: "Shift hotel to late arrival", ref: "HTL-8841-SHIFT" },
          { label: "Re-slot pickup to 00:15", ref: "PKP-2204-RS" },
        ],
      },
    ],
    resolvedNote: "Trip recovered · hotel shifted, pickup re-slotted, tour moved to 06:30",
  },
  {
    id: "xtra",
    tab: "6E-431 · DEL → BLR",
    flightNo: "6E-431",
    airline: "IndiGo",
    route: "DEL → BLR",
    routeDetail: "Delhi IGIA T1 → Bengaluru KIA T1 · 1 traveller",
    date: "Wed 10 Sep 2026",
    pax: "G. Madankar",
    schedDep: "07:10",
    schedArr: "09:55",
    triggerTitle: "Cancellation predicted",
    triggerDetail:
      "Crew-duty rotation break + fog-season aircraft swap pattern. Cancellation probability crossed 81% — official notice expected ~90 min out.",
    detectedAt: "04:48 IST",
    predictNote: "81% cancellation probability · crew + rotation features",
    cascade: [
      {
        id: "f1",
        kind: "flight",
        leg: "6E-431 · DEL → BLR",
        scheduled: "07:10 → 09:55",
        status: "cancelled",
        impact: "Flight scrubbed · full trip leg missing",
      },
      {
        id: "h1",
        kind: "hotel",
        leg: "ITC Gardenia Bengaluru",
        scheduled: "Check-in 12:00",
        status: "atrisk",
        impact: "Slips past 18:00 waste ₹6,200 night",
      },
      {
        id: "p1",
        kind: "pickup",
        leg: "BLR airport transfer",
        scheduled: "10:20 pickup",
        status: "atrisk",
        impact: "Free cancel inside 4h window",
      },
      {
        id: "a1",
        kind: "activity",
        leg: "Client workshop · MG Road",
        scheduled: "14:00 start",
        status: "atrisk",
        impact: "Hard start · joining remote is the fallback",
      },
      {
        id: "r1",
        kind: "return",
        leg: "6E-440 · BLR → DEL (11 Sep)",
        scheduled: "Held · unaffected",
        status: "ontime",
        impact: "Return leg intact · no action needed",
      },
    ],
    options: [
      {
        id: "a",
        title: "Next metal, same morning",
        tag: "RECOMMENDED",
        costDelta: 0,
        costNote: "₹0 delta",
        timeSaved: "~6 hrs saved",
        confidence: 93,
        reasoning: [
          "6E-537 departs 10:40, lands 13:25 — workshop at 14:00 stays reachable via ORR express lane.",
          "Cancelled leg converts to full refund under DGCA norms; hotel and pickup shift free.",
          "Highest confidence: same airline, same terminals, live seat map confirms 14 seats.",
        ],
        policySource: "DGCA CAR, Section 3",
        policyCite: "Cancelled flights: alternate flight or full refund + compensation",
        plan: [
          { label: "Book 6E-537 DEL-BLR 10:40", ref: "FLT-6E537-BK" },
          { label: "Refund 6E-431 in full", ref: "FLT-6E431-RF" },
          { label: "Shift hotel check-in + pickup", ref: "HTL-5520-SHIFT" },
          { label: "Send workshop join link as backup", ref: "NTF-0104" },
        ],
      },
      {
        id: "b",
        title: "Overnight halt, fly easy",
        tag: "LOWEST STRESS",
        costDelta: 6200,
        costNote: "+₹6,200",
        timeSaved: "~1 hr saved",
        confidence: 97,
        reasoning: [
          "Take the 18:20 departure, add one Delhi airport-hotel night — zero rush, zero risk.",
          "Workshop attends remotely at 14:00; in-person presence moves to day two.",
          "Best when the 14:00 start is immovable and travel fatigue matters.",
        ],
        policySource: "Airline CoC + hotel policy",
        policyCite: ".contrib delay: hotel + meals duty on airline for night halt",
        plan: [
          { label: "Book 18:20 DEL-BLR departure", ref: "FLT-1820-BK" },
          { label: "Add airport-hotel night, Delhi", ref: "HTL-DELN-01" },
          { label: "Push workshop to remote-first", ref: "NTF-0105" },
        ],
      },
      {
        id: "c",
        title: "Rail backup, keep the day",
        tag: "CHEAPEST",
        costDelta: -2400,
        costNote: "−₹2,400 refund",
        timeSaved: "~3 hrs saved",
        confidence: 84,
        reasoning: [
          "Vande Bharat 06:00 reaches in time for a late-afternoon workshop join.",
          "Flight refund funds the entire rail + transfer stack with surplus.",
          "Works only if the workshop tolerates a 16:30 in-person arrival.",
        ],
        policySource: "Rail + refund arithmetic",
        policyCite: "Full flight refund ₹8,900 vs rail ₹2,100 + transfers",
        plan: [
          { label: "Book Vande Bharat 06:00 CC", ref: "TRN-VB06-BK" },
          { label: "Refund 6E-431 in full", ref: "FLT-6E431-RF" },
          { label: "Shift hotel to evening check-in", ref: "HTL-5520-SHIFT" },
        ],
      },
    ],
    resolvedNote: "Trip recovered · rebooked 6E-537, hotel + pickup shifted, workshop backup link sent",
  },
  {
    id: "uk977",
    tab: "UK-977 · BOM transit",
    flightNo: "UK-977",
    airline: "Vistara",
    route: "BOM → DEL → IXC",
    routeDetail: "Mumbai → Delhi → Chandigarh · 55-min connection · 2 travellers",
    date: "Thu 11 Sep 2026",
    pax: "G. Madankar + 1",
    schedDep: "13:20",
    schedArr: "18:05 (IXC)",
    triggerTitle: "Misconnect risk 74%",
    triggerDetail:
      "Inbound delay compresses the DEL transit to ~22 min against a 45-min minimum connect time. GNN flags the onward leg as the cascade point.",
    detectedAt: "11:05 IST",
    predictNote: "74% misconnect probability · MCT 45 min vs 22 min projected",
    cascade: [
      {
        id: "f1",
        kind: "flight",
        leg: "UK-977 · BOM → DEL",
        scheduled: "13:20 → 15:35",
        status: "delayed",
        impact: "~35 min late · transit collapsing",
      },
      {
        id: "r1",
        kind: "return",
        leg: "UK-978 · DEL → IXC connection",
        scheduled: "16:30 departure",
        status: "atrisk",
        impact: "22 vs 45 min MCT · next flight 21:10",
      },
      {
        id: "p1",
        kind: "pickup",
        leg: "Chandigarh station pickup",
        scheduled: "18:40 pickup",
        status: "atrisk",
        impact: "Floats with arrival · free re-slot",
      },
      {
        id: "h1",
        kind: "hotel",
        leg: "Taj Chandigarh",
        scheduled: "Check-in 19:30",
        status: "ontime",
        impact: "24h desk absorbs late arrival",
      },
      {
        id: "a1",
        kind: "activity",
        leg: "Rock Garden morning slot (12 Sep)",
        scheduled: "Next day · unaffected",
        status: "ontime",
        impact: "Next-day plan intact whatever happens",
      },
    ],
    options: [
      {
        id: "a",
        title: "Protect the connection now",
        tag: "RECOMMENDED",
        costDelta: 0,
        costNote: "₹0 delta",
        timeSaved: "~3 hrs saved",
        confidence: 95,
        reasoning: [
          "Move both travellers to the 21:10 DEL-IXC while seats hold — same PNR family, no fare gap.",
          "Pickup re-slots to 22:00 free; hotel absorbs the late arrival.",
          "Acting pre-emptively beats the airport scramble after a missed connection.",
        ],
        policySource: "Airline CoC (misconnect)",
        policyCite: "Protected connection: free re-accommodation on next available",
        plan: [
          { label: "Move to 21:10 DEL-IXC, 2 seats", ref: "FLT-2110-BK" },
          { label: "Re-slot Chandigarh pickup 22:00", ref: "PKP-IXC-RS" },
          { label: "Confirm late arrival with Taj", ref: "HTL-TAJ-OK" },
        ],
      },
      {
        id: "b",
        title: "Go direct, skip Delhi",
        tag: "FASTEST",
        costDelta: 3400,
        costNote: "+₹3,400",
        timeSaved: "~4 hrs saved",
        confidence: 89,
        reasoning: [
          "Direct BOM-IXC charter leg at 15:00 lands before any connection drama.",
          "Eliminates misconnect risk entirely; pickup and hotel stay as booked.",
          "Premium pick — worth it when the evening in Chandigarh is fixed.",
        ],
        policySource: "Rebooking quote",
        policyCite: "Direct-leg premium ₹3,400 for 2 pax · live inventory",
        plan: [
          { label: "Book direct BOM-IXC 15:00", ref: "FLT-DRCT-BK" },
          { label: "Refund DEL-IXC coupons", ref: "FLT-UK978-RF" },
          { label: "Confirm pickup + hotel unchanged", ref: "HTL-TAJ-OK" },
        ],
      },
      {
        id: "c",
        title: "Hold and sprint",
        tag: "CHEAPEST",
        costDelta: 0,
        costNote: "₹0 delta",
        timeSaved: "0 hrs",
        confidence: 61,
        reasoning: [
          "If the inbound makes up 15 min en route, a gate-to-gate sprint can still connect.",
          "Zero cost, but the model gives it only 61% — crew pre-boards the rebook as backup.",
          "Only for travellers who genuinely prefer to gamble the connection.",
        ],
        policySource: "Connection model",
        policyCite: "22 min vs 45 min MCT · make-up-time distribution p61",
        plan: [
          { label: "Pre-board 21:10 backup seats", ref: "FLT-2110-HOLD" },
          { label: "Request gate assistance at DEL", ref: "AST-DEL-GATE" },
        ],
      },
    ],
    resolvedNote: "Trip recovered · protected on 21:10 connection, pickup re-slotted, hotel confirmed",
  },
];

export function formatINR(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}₹${Math.abs(n).toLocaleString("en-IN")}`;
}
