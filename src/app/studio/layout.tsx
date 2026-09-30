import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mikaelson Studio | Content & Editorial Engine",
  description: "Official editorial writing and publishing studio for the Mikaelson Initiative.",
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
    <div className="min-h-screen bg-[#F4F9F9] text-[#111111] antialiased selection:bg-[#5CE1E6]/30 dark:bg-[#050A0A] dark:text-[#EEEEEE]">
      {children}
    </div>
  );
}
