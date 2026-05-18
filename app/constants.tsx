import type { ReactNode } from "react";

const svgProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const IconUsers = (
  <svg {...svgProps}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconBolt = (
  <svg {...svgProps}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const IconGlobe = (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconFile = (
  <svg {...svgProps}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const IconBriefcase = (
  <svg {...svgProps}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconBuilding = (
  <svg {...svgProps}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconMonitor = (
  <svg {...svgProps}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const IconHeadset = (
  <svg {...svgProps}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconServer = (
  <svg {...svgProps}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const IconDevice = (
  <svg {...svgProps}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const IconPin = (
  <svg {...svgProps}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconBox = (
  <svg {...svgProps}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);

const IconLink = (
  <svg {...svgProps}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const IconRefresh = (
  <svg {...svgProps}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
  </svg>
);

const IconSearch = (
  <svg {...svgProps}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconCode = (
  <svg {...svgProps}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconMail = (
  <svg {...svgProps}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export const ArrowRightIcon = (
  <svg {...svgProps} width="16" height="16" strokeWidth={2.5}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#founders", label: "Leadership" },
  { href: "/#services", label: "Services" },
  { href: "/#depot", label: "Depot" },
  { href: "/#certifications", label: "Certifications" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
];

export const HERO_TRUST_ITEMS = [
  "ISO 9001 & ISO 27001 Certified",
  "MBE Certified",
  "Operations in 44+ Countries",
];

export const HERO_PROOF_CARDS: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: IconUsers,
    title: "Vetted Technician Network",
    body: "Over 52,000 pre-qualified field engineers available for rapid mobilization worldwide.",
  },
  {
    icon: IconBolt,
    title: "Proven SLA Performance",
    body: "99.2% SLA achievement across 83+ active enterprise accounts and complex multi-site engagements.",
  },
  {
    icon: IconGlobe,
    title: "True Global Reach",
    body: "Coordinated field operations spanning 44 countries with centralized dispatch management.",
  },
];

export const CLIENT_LOGOS = [
  "HCL",
  "TCS",
  "Cognizant",
  "Birlasoft",
  "Mindsprint",
  "Hexaware",
  "Wipro",
];

export type StatItem = {
  target: number;
  suffix: string;
  decimals: number;
  label: string;
  icon: ReactNode;
};

export const STATS: StatItem[] = [
  { target: 2847, suffix: "+", decimals: 0, label: "Avg Monthly Tickets", icon: IconFile },
  { target: 52400, suffix: "+", decimals: 0, label: "Tech Database", icon: IconUsers },
  { target: 83, suffix: "+", decimals: 0, label: "Active Accounts", icon: IconBriefcase },
  { target: 43600, suffix: "+", decimals: 0, label: "Sites Supported", icon: IconBuilding },
  { target: 99.2, suffix: "%", decimals: 1, label: "SLA Achievement", icon: IconBolt },
  { target: 44, suffix: "+", decimals: 0, label: "Countries", icon: IconGlobe },
];

export const ABOUT_FEATURES: { title: string; body: string; icon: ReactNode }[] = [
  {
    icon: IconUsers,
    title: "1,000+ Employees — 500+ W2s in the USA",
    body: "A deep bench of full-time W2 employees supplemented by an extensive contractor network, ensuring compliance, accountability, and consistent delivery quality.",
  },
  {
    icon: IconBolt,
    title: "Preferred Subcontractor for Global SIs",
    body: "Trusted by the world’s leading systems integrators — delivering consistent, measurable outcomes across complex, multi-vendor environments.",
  },
  {
    icon: IconGlobe,
    title: "MBE-Certified Diversity Partner",
    body: "Certified Minority Business Enterprise enabling clients to meet supplier diversity goals without compromising on service quality or global capability.",
  },
];

export const ABOUT_DELIVERY_LIST = [
  "Centralised dispatch hub managing global ticket routing",
  "Regional delivery managers ensuring local expertise",
  "Dedicated account teams with defined SLA frameworks",
  "Real-time reporting and client-facing dashboards",
  "ISO-certified quality management processes",
  "Vendor-neutral procurement and parts logistics",
  "24/7 escalation management and executive support",
];

export const ABOUT_PILLS = ["ISO 9001", "ISO 27001", "MBE", "W2 Workforce"];

export type Service = {
  title: string;
  description: string;
  tags: string[];
  icon: ReactNode;
};

export const SERVICES: Service[] = [
  {
    icon: IconMonitor,
    title: "Break/Fix Field Services",
    description:
      "Rapid on-site hardware repair and maintenance across all major OEMs. Certified technicians respond to incidents with speed and precision, minimising downtime and business disruption.",
    tags: ["On-Site Repair", "OEM Certified", "Same-Day SLA"],
  },
  {
    icon: IconUsers,
    title: "IT Staffing & Contingent Workforce",
    description:
      "W2, contract, contract-to-hire, and direct placement across infrastructure, networking, end-user support, and field operations. Flexible engagement models for every business need.",
    tags: ["W2 Placement", "Contract", "Direct Hire"],
  },
  {
    icon: IconHeadset,
    title: "Managed Dispatch & Help Desk",
    description:
      "24/7 centralised dispatch operations handling thousands of tickets monthly. Dedicated NOC and Help Desk teams providing Tier 1–3 support with full escalation management.",
    tags: ["24/7 NOC", "Tier 1–3", "Dispatch"],
  },
  {
    icon: IconServer,
    title: "Infrastructure & Data Center",
    description:
      "Expert delivery of server installations, network builds, cabling, rack & stack, and data center migrations. Certified professionals for enterprise hardware and critical infrastructure.",
    tags: ["Data Center", "Rack & Stack", "Network Build"],
  },
  {
    icon: IconDevice,
    title: "End-User Computing & IMAC",
    description:
      "Large-scale deployments, refresh cycles, IMAC (Install, Move, Add, Change), and white-glove end-user support. Coordinated project management ensuring minimal operational disruption.",
    tags: ["IMAC", "Device Refresh", "Deployment"],
  },
  {
    icon: IconPin,
    title: "Managed Site Services",
    description:
      "Dedicated or shared on-site IT support resources aligned to your locations. From retail branches and bank networks to corporate campuses, consistent quality at every site.",
    tags: ["On-Site Staff", "Multi-Site", "Retail / Banking"],
  },
];

export type DepotItem = { title: string; desc: string; icon: ReactNode };

export const DEPOT_ITEMS: DepotItem[] = [
  {
    icon: IconBox,
    title: "Asset & Inventory Management",
    desc: "Full chain-of-custody asset tracking, serialisation, and inventory management with real-time visibility portals.",
  },
  {
    icon: IconLink,
    title: "Hardware Replacement & Deployment",
    desc: "Certified repair, component-level diagnostics, OEM part sourcing, and staged deployment to end-user locations.",
  },
  {
    icon: IconRefresh,
    title: "Equipment Recovery & Returns",
    desc: "Structured asset recovery including secure decommission, logistics coordination, and data-sanitised return processing.",
  },
  {
    icon: IconSearch,
    title: "Diagnostics & Quality Testing",
    desc: "Comprehensive hardware diagnostics and QA testing. Every device validated against client specifications before leaving the depot.",
  },
  {
    icon: IconCode,
    title: "Depot Engineering Services",
    desc: "OS image creation, custom scripting, BIOS configuration, and build-to-spec deployment engineering for large-scale rollouts.",
  },
];

export const DEPOT_CAPABILITIES: { strong: string; rest: string }[] = [
  { strong: "Windows Imaging", rest: "Custom OS builds & scripting" },
  { strong: "BIOS & Firmware", rest: "Configuration & standardisation" },
  { strong: "Kitting & Staging", rest: "Pre-deployment preparation" },
  { strong: "Parts Stocking", rest: "OEM inventory management" },
  { strong: "Logistics & Shipping", rest: "Nationwide & international" },
  { strong: "Data Sanitisation", rest: "NIST 800-88 compliant" },
  { strong: "Asset Tagging", rest: "Full serialisation & ITAM" },
  { strong: "Reporting Portal", rest: "Real-time client visibility" },
];

export type Founder = {
  initials: string;
  imageSrc?: string;
  name: string;
  title: string;
  bio: string;
  tags: string[];
  linkedinUrl?: string;
};

export const FOUNDERS: Founder[] = [
  {
    initials: "MM",
    imageSrc: "/Mohit%20Manchanda.jpg",
    name: "Mohit Manchanda",
    title: "Chief Executive Officer",
    bio: "A 30+ year veteran of the global IT services industry, Mohit has held senior executive roles spanning technology sourcing, infrastructure delivery, and client acquisition. As CEO, he architects Ovation's growth strategy and operational model, drawing on deep relationships with Fortune 500 clients and tier-1 systems integrators worldwide.",
    tags: ["30+ Years IT Services", "Infrastructure", "Global Operations"],
    linkedinUrl: "https://www.linkedin.com/in/mohitmanchanda/",
  },
  {
    initials: "SM",
    imageSrc: "/sameer.jpg",
    name: "Sameer Mittal",
    title: "President & CFO",
    bio: "A serial entrepreneur and finance executive, Sameer previously grew UK WEST INC from seed-stage to 700+ employees worldwide. As co-founder of TopHat Capital, he oversaw $600M+ in capital raises and M&A transactions. At Ovation, Sameer drives financial strategy, business development, and corporate partnerships.",
    tags: ["Investment Banking", "$600M+ Capital", "Entrepreneurship"],
    linkedinUrl: "https://www.linkedin.com/in/sameermittal/",
  },
  {
    initials: "NG",
    imageSrc: "/Nithin.jpg",
    name: "Nitin Grover",
    title: "Chief Revenue Officer",
    bio: "Nitin brings distinguished sales and revenue leadership experience from Barrister Global Services Network and DecisionOne, where he served as VP of Sales driving enterprise IT services growth across North America. As CRO, he leads Ovation's go-to-market strategy, enterprise sales, and strategic account management.",
    tags: ["Enterprise Sales", "Revenue Growth", "IT Services"],
    linkedinUrl: "https://www.linkedin.com/in/nitingrover/",
  },
];

const IconAward = (
  <svg {...svgProps}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.5 12.8 17 22l-5-3-5 3 1.5-9.2" />
  </svg>
);

const IconShieldCheck = (
  <svg {...svgProps}>
    <path d="M12 2 4 5v7c0 5 3.4 9.2 8 10 4.6-.8 8-5 8-10V5l-8-3z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconBadgeCheck = (
  <svg {...svgProps}>
    <path d="M12 2 9.5 4.5 6 4l-.5 3.5L2 9l1.5 3.5L2 16l3.5 1L6 20.5 9.5 20 12 22.5 14.5 20l3.5.5.5-3.5L22 16l-1.5-3.5L22 9l-3.5-1.5L18 4l-3.5.5L12 2z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export type Cert = {
  iconBg: string;
  iconColor: string;
  ringColor: string;
  icon: ReactNode;
  /** When set, this logo image is shown instead of the `icon` SVG. */
  iconImage?: string;
  label: string;
  title: string;
  desc: string;
};

export const CERTS: Cert[] = [
  {
    iconBg: "bg-[#ebf5fb] dark:bg-[#1e3a8a]/30",
    iconColor: "text-[#1d4ed8] dark:text-[#93c5fd]",
    ringColor: "ring-[#1d4ed8]/15 dark:ring-[#93c5fd]/20",
    icon: IconAward,
    iconImage: "/iso9001.svg",
    label: "Quality",
    title: "ISO 9001:2015",
    desc: "Quality Management System — certified processes for consistent, client-centric service delivery across all operations.",
  },
  {
    iconBg: "bg-[#eaf7f0] dark:bg-[#065f46]/30",
    iconColor: "text-[#047857] dark:text-[#6ee7b7]",
    ringColor: "ring-[#047857]/15 dark:ring-[#6ee7b7]/20",
    icon: IconShieldCheck,
    iconImage: "/ISO27001.svg",
    label: "Security",
    title: "ISO 27001:2022",
    desc: "Information Security Management — enterprise-grade data protection protocols, access controls, and security governance.",
  },
  {
    iconBg: "bg-[#fef9e7] dark:bg-[#854d0e]/30",
    iconColor: "text-[#b45309] dark:text-[#fcd34d]",
    ringColor: "ring-[#b45309]/15 dark:ring-[#fcd34d]/20",
    icon: IconBadgeCheck,
    iconImage: "/nmsdc.jpg",
    label: "Diversity",
    title: "MBE Certified",
    desc: "Minority Business Enterprise — verified diverse supplier helping clients meet and exceed supplier diversity commitments.",
  },
];

export type OfficeLocation = {
  city: string;
  address: string[];
};

export const HEADQUARTERS: OfficeLocation = {
  city: "New Jersey, USA",
  address: ["55 Union Place #237", "Summit, NJ 07901"],
};

export const DELIVERY_CENTERS: OfficeLocation[] = [
  {
    city: "Toronto, Canada",
    address: ["2 Queen Street East, Suite 1500,", "Toronto, Ontario, M5C 3G5, Canada"],
  },
  {
    city: "Noida, India",
    address: [
      "Unit No. 1101, 11th Floor, Tower-1, Assotech",
      "Business Cresterra,",
      "Plot No. 22, Sector-135, Noida 201305, Distt.",
      "Gautam Budh Nagar, U.P",
    ],
  },
  {
    city: "Mumbai, India",
    address: [
      "906, 93 East Building,",
      "304, Mahakali Caves Rd, Shanti Nagar,",
      "Andheri East,",
      "Mumbai, Maharashtra 400093",
    ],
  },
  {
    city: "Pune",
    address: ["B - 901, Kapil Abhijat, Commins Circle,", "Kothrud,", "Pune, Maharashtra - 411038"],
  },
];

export const CONTACT_SERVICE_OPTIONS = [
  "Break/Fix Field Services",
  "IT Staffing & Workforce",
  "Managed Dispatch & Help Desk",
  "Infrastructure & Data Center",
  "End-User Computing & IMAC",
  "Depot Services",
  "Managed Site Services",
  "Other / Multiple Services",
];

export const CONTACT_INFO: { text: string; icon: ReactNode }[] = [
  { icon: IconHeadset, text: "+1 (888) OVN-TECH — Available 24/7" },
  { icon: IconMail, text: "info@ovationwps.com" },
  { icon: IconPin, text: "Headquarters: USA • Operations: 44+ Countries" },
];

export const FOOTER_COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Services",
    links: [
      { href: "#services", label: "Break/Fix Services" },
      { href: "#services", label: "IT Staffing" },
      { href: "#services", label: "Managed Dispatch" },
      { href: "#services", label: "Infrastructure" },
      { href: "#depot", label: "Depot Services" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "#about", label: "About Us" },
      { href: "#founders", label: "Leadership" },
      { href: "#certifications", label: "Certifications" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { href: "#contact", label: "Contact Us" },
      { href: "https://www.ovationwps.com", label: "Website" },
      { href: "mailto:info@ovationwps.com", label: "Email" },
    ],
  },
];

export const FOOTER_CERT_PILLS = ["ISO 9001", "ISO 27001", "MBE Certified"];

export const FOOTER_BRAND_TAGLINE =
  "Global IT workforce and managed services partner. Trusted by industry leaders across 44+ countries.";

export const FOOTER_COPYRIGHT = "© 2026 Ovation Workplace Services. All rights reserved.";

export const COMPANY = {
  name: "Ovation",
  fullName: "Ovation Workplace Services",
};

export const PARTNER_HERO_IMAGE =
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=80";

export const PARTNER_HERO_STATS: { value: string; label: string }[] = [
  { value: "52K+", label: "Vetted technicians" },
  { value: "44+", label: "Countries covered" },
  { value: "99.2%", label: "SLA achievement" },
  { value: "83+", label: "Enterprise accounts" },
];

export const PARTNER_BENEFITS: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: IconGlobe,
    title: "Global Coverage, One Contract",
    body: "Consolidate field operations in 44+ countries under a single SLA — no more juggling regional MSPs or fragmented vendor stacks.",
  },
  {
    icon: IconBolt,
    title: "Rapid Mobilisation",
    body: "Pre-vetted talent pools deploy in hours, not weeks. From break/fix dispatch to multi-site rollouts, we move at enterprise speed.",
  },
  {
    icon: IconUsers,
    title: "Co-Branded Delivery",
    body: "White-label or co-branded engagements designed to extend your offering — your customer, your relationship, our execution muscle.",
  },
  {
    icon: IconHeadset,
    title: "Dedicated Partner Desk",
    body: "Named program manager, joint QBRs, and a 24/7 escalation line. You always know who is on the other end of the phone.",
  },
  {
    icon: IconRefresh,
    title: "Flexible Commercial Models",
    body: "Per-ticket, T&M, fixed-fee, or fully managed — we shape the deal around your margin profile, not the other way around.",
  },
  {
    icon: IconBriefcase,
    title: "Compliance & Trust",
    body: "ISO 9001, ISO 27001, MBE-certified, with documented data residency, background checks, and supply-chain transparency.",
  },
];

export const PARTNER_TIERS: {
  name: string;
  tagline: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}[] = [
  {
    name: "Referral",
    tagline: "Pass the lead, share the upside.",
    description:
      "Send opportunities our way and earn revenue share on closed engagements — minimal lift, no delivery responsibility.",
    features: [
      "Revenue share on closed deals",
      "Co-marketing assets & one-pagers",
      "Quarterly partner sync",
      "Single point of contact",
    ],
  },
  {
    name: "Reseller",
    tagline: "Sell Ovation services under your paper.",
    description:
      "Wrap Ovation field, depot, and dispatch services into your portfolio with white-label collateral and margin protection.",
    features: [
      "White-label SOWs & service catalogue",
      "Tiered margin structure",
      "Joint pre-sales engineering",
      "Branded customer reporting",
      "Dedicated channel manager",
    ],
    highlighted: true,
  },
  {
    name: "Strategic Alliance",
    tagline: "Build the practice together.",
    description:
      "For OEMs, integrators, and global MSPs running multi-year programs — joint go-to-market, embedded delivery, executive sponsorship.",
    features: [
      "Joint go-to-market planning",
      "Embedded delivery & dispatch pods",
      "Custom commercial constructs",
      "Executive QBRs & roadmap access",
      "First-look on new geographies",
    ],
  },
];

export const PARTNER_PROCESS: { step: string; title: string; body: string }[] = [
  {
    step: "01",
    title: "Discover",
    body: "30-minute intro to understand your customer base, geographies, and where Ovation fits inside your delivery stack.",
  },
  {
    step: "02",
    title: "Design",
    body: "We co-build the commercial model, SLAs, and engagement playbook — sized to your first 12 months of pipeline.",
  },
  {
    step: "03",
    title: "Deploy",
    body: "Partner agreement signed, channel manager onboarded, and your first joint pursuit kicked off within 30 days.",
  },
  {
    step: "04",
    title: "Scale",
    body: "Quarterly business reviews, pipeline reviews, and shared dashboards keep the partnership compounding year over year.",
  },
];

export const PARTNER_AUDIENCES: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: IconBuilding,
    title: "Global MSPs",
    body: "Plug gaps in your geographic coverage or tech depth without standing up new field operations.",
  },
  {
    icon: IconServer,
    title: "OEMs & Hardware Vendors",
    body: "Outsource warranty, install-base, and refresh work to a partner with depot and on-site coverage in one stack.",
  },
  {
    icon: IconCode,
    title: "Systems Integrators",
    body: "Extend your program delivery with field hands, dispatch, and logistics that scale with your largest customers.",
  },
  {
    icon: IconLink,
    title: "Software & SaaS",
    body: "Offer your customers a managed onboarding, install, or refresh service co-delivered by Ovation.",
  },
];

export const PARTNER_TESTIMONIAL = {
  quote:
    "Ovation has become an extension of our delivery team. When we win a global rollout, they are in the room from day one — same playbook, same standards, one customer experience.",
  name: "Strategic Channel Partner",
  role: "VP of Global Services · Fortune 500 MSP",
};

export const PARTNER_FAQS: { q: string; a: string }[] = [
  {
    q: "How quickly can a new partner go live?",
    a: "Most partners are signed and trained within 30 days. For referral arrangements it is often quicker — we have onboarded partners in under a week when there is an active opportunity on the table.",
  },
  {
    q: "Will you compete with us downstream?",
    a: "No. Channel-sourced opportunities are protected by deal registration. We do not sell directly into accounts that came through a partner, and our field teams operate on partner-branded playbooks where required.",
  },
  {
    q: "Which regions do you cover?",
    a: "Active delivery in 44+ countries across North America, EMEA, APAC, and LATAM, with depot and dispatch hubs in the US and India. We add new geographies on demand for strategic alliance partners.",
  },
  {
    q: "Can you white-label customer-facing reporting?",
    a: "Yes. Reseller and strategic partners get branded portals, ticket reporting, and SLA dashboards. Your customers see your brand — Ovation runs the engine underneath.",
  },
  {
    q: "What commercial models do you support?",
    a: "Per-ticket dispatch, time & materials, fixed-fee managed services, and hybrid constructs. We shape pricing around your margin profile and the customer's buying preference.",
  },
];

export const CAREERS_HERO_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80";

export const CAREERS_HERO_LOCATIONS = [
  "Hyderabad",
  "Plano, TX",
  "Remote · 44+ countries",
];

export const CAREERS_LIFE: { step: string; title: string; body: string }[] = [
  {
    step: "01",
    title: "Volunteer Days",
    body: "Every Ovation teammate gets 16 paid hours per year to volunteer with causes that matter to them.",
  },
  {
    step: "02",
    title: "Ovation Cares Month",
    body: "Each March we run a company-wide month of giving — drives, hackathons, and community partnerships.",
  },
  {
    step: "03",
    title: "In-person Gatherings",
    body: "Distributed by default — but we fly teams together for annual summits, regional meetups, and project kickoffs.",
  },
  {
    step: "04",
    title: "Community Giving",
    body: "Long-running partnerships with local nonprofits in every region we operate, matched by company donations.",
  },
  {
    step: "05",
    title: "Diversity & Inclusion",
    body: "MBE-certified workplace with active ERGs and a leadership team that reflects the 44 countries we serve.",
  },
];

export const CAREERS_GALLERY: { src: string; alt: string; tall?: boolean }[] = [
  {
    src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
    alt: "Ovation team collaborating on a project",
    tall: true,
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80",
    alt: "Engineers reviewing code together",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    alt: "Coworkers laughing at the office",
  },
  {
    src: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=900&q=80",
    alt: "Workshop session with sticky notes",
  },
  {
    src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=900&q=80",
    alt: "Whiteboarding architecture",
    tall: true,
  },
  {
    src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80",
    alt: "Group photo of the team at an offsite",
  },
];

export const CAREERS_TESTIMONIAL = {
  quote:
    "Ovation feels like one team, one dream. People here actually back each other up — when something is on fire at 2am, you are not alone, and when you ship something great, the whole company celebrates with you.",
  name: "Priya N.",
  role: "Senior Talent Partner",
  photo:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
};
