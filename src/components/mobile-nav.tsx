"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { ModeToggle } from "./mode-toggler";
import { cn } from "@/lib/utils";

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

interface MobileNavProps {
  brandName: string;
  navLinks: NavLink[];
  actionButton?: ActionButton;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  brandName,
  navLinks,
  actionButton,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggle = (label: string) =>
    setOpenDropdown((prev) => (prev === label ? null : label));

  return (
    <div className="lg:hidden flex items-center gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <button aria-label="Open menu">
            <Menu className="h-6 w-6 dark:text-white" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 sm:w-80">
          <SheetHeader>
            <SheetTitle className="sr-only">{brandName}</SheetTitle>
          </SheetHeader>

          <nav className="mt-6 px-5 flex flex-col gap-0.5">
            {navLinks.map((link) => {
              if (link.dropdown) {
                const isOpen = openDropdown === link.label;
                return (
                  <div key={link.label}>
                    <button
                      onClick={() => toggle(link.label)}
                      className="flex items-center justify-between w-full px-2 py-2.5 rounded-lg text-[15px] font-medium text-gray-700 dark:text-white/80 hover:text-[#5CE1E6] dark:hover:text-[#5CE1E6] hover:bg-[#5CE1E6]/5 transition-colors duration-150"
                    >
                      {link.label}
                      <ChevronDown
                        size={15}
                        strokeWidth={2.5}
                        className={cn(
                          "text-gray-400 dark:text-white/40 transition-transform duration-200",
                          isOpen && "rotate-180 text-[#5CE1E6]"
                        )}
                      />
                    </button>

                    {isOpen && (
                      <div className="ml-3 mb-1 pl-3 border-l-2 border-[#5CE1E6]/30 flex flex-col gap-0.5">
                        {link.dropdown.map((item) => (
                          <SheetClose asChild key={item.label + item.href}>
                            <Link
                              href={item.href}
                              className="px-2 py-2 text-sm text-gray-600 dark:text-white/60 hover:text-[#5CE1E6] dark:hover:text-[#5CE1E6] rounded-md hover:bg-[#5CE1E6]/5 transition-colors duration-150"
                            >
                              {item.label}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <SheetClose asChild key={link.label}>
                  <Link
                    href={link.href}
                    className="px-2 py-2.5 rounded-lg text-[15px] font-medium text-gray-700 dark:text-white/80 hover:text-[#5CE1E6] dark:hover:text-[#5CE1E6] hover:bg-[#5CE1E6]/5 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              );
            })}

            {actionButton && (
              <div className="pt-5">
                <SheetClose asChild>
                  <Link
                    href={actionButton.href}
                    className="inline-flex min-h-11 w-full items-center justify-center px-5 py-2.5 text-sm rounded-full bg-[#5CE1E6] font-bold text-[#050A0A] shadow-[0_6px_0_-1px_#003E45] transition-[translate,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:translate-y-[2px] hover:shadow-[0_4px_0_-1px_#003E45] active:translate-y-[4px] active:shadow-[0_1px_0_-1px_#003E45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7]"
                  >
                    {actionButton.label}
                  </Link>
                </SheetClose>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>
      <ModeToggle />
    </div>
  );
};
