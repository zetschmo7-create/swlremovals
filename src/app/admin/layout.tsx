import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jarvis Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#0a1410] text-cream antialiased">{children}</div>
  );
}
