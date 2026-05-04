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
  { href: "#about", label: "About" },
  { href: "#founders", label: "Leadership" },
  { href: "#services", label: "Services" },
  { href: "#depot", label: "Depot" },
  { href: "#certifications", label: "Certifications" },
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

export type Cert = { badgeBg: string; emoji: string; title: string; desc: string };

export const CERTS: Cert[] = [
  {
    badgeBg: "bg-[#ebf5fb]",
    emoji: "\u{1F3C5}",
    title: "ISO 9001:2015",
    desc: "Quality Management System — certified processes for consistent, client-centric service delivery across all operations.",
  },
  {
    badgeBg: "bg-[#eaf7f0]",
    emoji: "\u{1F512}",
    title: "ISO 27001:2022",
    desc: "Information Security Management — enterprise-grade data protection protocols, access controls, and security governance.",
  },
  {
    badgeBg: "bg-[#fef9e7]",
    emoji: "⭐",
    title: "MBE Certified",
    desc: "Minority Business Enterprise — verified diverse supplier helping clients meet and exceed supplier diversity commitments.",
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
