import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ovation Workplace Services | IT Workforce & Managed Solutions",
  description:
    "From break/fix field services to enterprise dispatch management, Ovation delivers skilled technicians, seamless logistics, and proven SLA compliance — across every timezone, at every scale.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  keywords: [
    "IT services",
    "break fix",
    "field services",
    "managed dispatch",
    "depot services",
    "IT staffing",
    "infrastructure",
    "data center",
    "global IT partner",
    "MBE certified",
  ],
  openGraph: {
    title: "Ovation Workplace Services | Global IT Workforce Partner",
    description:
      "Skilled technicians, seamless logistics, and proven SLA compliance — across every timezone, at every scale.",
    type: "website",
    siteName: "Ovation Workplace Services",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ovation Workplace Services",
    description: "Global IT workforce partner — field, depot, dispatch.",
  },
};

const themeInitScript = `(function(){try{var k='ovation-theme';var s=localStorage.getItem(k);var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=s? s==='dark' : m;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}