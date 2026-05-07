import { ReactNode } from "react";
import { AuthProvider } from "../components/AuthProvider";

export const metadata = {
  title: "Admin · Ovation Workplace Services",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-ink-100 dark:bg-navy-deep">{children}</div>
    </AuthProvider>
  );
}
