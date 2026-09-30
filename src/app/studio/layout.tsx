import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mikaelson Initiative Studio | Blog & Content Editor",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] h-screen w-screen overflow-hidden bg-white dark:bg-[#101112]">
      {children}
    </div>
  );
}
