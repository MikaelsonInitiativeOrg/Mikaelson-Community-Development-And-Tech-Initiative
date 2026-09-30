"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggler";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
}

interface ActionButton {
  label: string;
  href: string;
}

interface HeaderProps {
  brandName?: string;
  navLinks?: NavLink[];
  actionButton?: ActionButton;
}

const Header: React.FC<HeaderProps> = ({
  brandName = "Mikaelson Initiative",
  navLinks = [
    { label: "Home", href: "/" },
    {
      label: "About Us",
      href: "/about-us",
      dropdown: [
        { label: "About Us", href: "/about-us" },
        { label: "Our Team", href: "/team" },
        { label: "Our Ecosystem", href: "/#our-ecosystem" },
      ],
    },
    {
      label: "Get Involved",
      href: "/sponsor",
      dropdown: [
        { label: "Sponsor a Project", href: "/sponsor" },
        { label: "Partner with Us", href: "/sponsor#how-to-partner" },
        { label: "Volunteer with Us", href: "/volunteer" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    { label: "Our Blog", href: "/blog" },
  ],
  actionButton = { label: "Sponsor a program", href: "/sponsor" },
}) => {
  const pathName = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#111111]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-10">

        {/* logo */}
        <Link href="/" className="flex items-center gap-3 font-bold tracking-tight group">
          <Image
            src="/assets/images/mikaelsonlogo.png"
            alt="Mikaelson Initiative"
            width={35}
            height={35}
            className="rounded-md"
          />
          <span className="text-sm md:text-base dark:text-white text-[#111] group-hover:text-[#5CE1E6] transition-colors duration-200">
            {brandName}
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = link.dropdown
              ? link.dropdown.some((d) => pathName === d.href)
              : pathName === link.href;

            if (link.dropdown) {
              return (
                <div key={link.label} className="relative group">
                  <button
                    className={cn(
                      "relative flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      "dark:text-white/70 text-[#444] hover:text-[#111] dark:hover:text-white",
                      "hover:bg-[#5CE1E6]/8 dark:hover:bg-white/5",
                      isActive &&
                        "text-[#5CE1E6] dark:text-[#5CE1E6] bg-[#5CE1E6]/8 dark:bg-[#5CE1E6]/10"
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      size={13}
                      strokeWidth={2.5}
                      className="transition-transform duration-200 group-hover:rotate-180"
                    />
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#5CE1E6] rounded-full" />
                    )}
                  </button>

                  {/* dropdown panel */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                    <div className="bg-white dark:bg-[#1a1a1a] border border-black/[0.08] dark:border-white/[0.08] rounded-xl shadow-lg shadow-black/[0.06] overflow-hidden min-w-[170px] py-1">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={cn(
                            "flex items-center px-4 py-2.5 text-sm transition-colors duration-150",
                            pathName === item.href
                              ? "text-[#5CE1E6] bg-[#5CE1E6]/8"
                              : "text-[#444] dark:text-white/70 hover:text-[#111] dark:hover:text-white hover:bg-[#5CE1E6]/5 dark:hover:bg-white/5"
                          )}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  "dark:text-white/70 text-[#444] hover:text-[#111] dark:hover:text-white",
                  "hover:bg-[#5CE1E6]/8 dark:hover:bg-white/5",
                  isActive &&
                    "text-[#5CE1E6] dark:text-[#5CE1E6] bg-[#5CE1E6]/8 dark:bg-[#5CE1E6]/10"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#5CE1E6] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* action button */}
        <div className="hidden lg:flex items-center gap-3">
          <ModeToggle />
          {actionButton && (
            <Link
              href={actionButton.href}
              // The home hero's chunky "shadow step" button, with a shorter step to fit the bar.
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm rounded-full bg-[#5CE1E6] font-bold text-[#050A0A] shadow-[0_6px_0_-1px_#003E45] transition-[translate,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:translate-y-[2px] hover:shadow-[0_4px_0_-1px_#003E45] active:translate-y-[4px] active:shadow-[0_1px_0_-1px_#003E45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7]"
            >
              {actionButton.label}
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          )}
        </div>

        {/* mobile */}
        <MobileNav
          brandName={brandName}
          navLinks={navLinks}
          actionButton={actionButton}
        />
      </div>
    </header>
  );
};

export default Header;
