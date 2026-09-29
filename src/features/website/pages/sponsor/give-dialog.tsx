"use client";

import { useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PAYSTACK_URL, WIRE } from "./data";
import { btn } from "./styles";

/**
 * The original's two dialogs (payment method → wire transfer) in one: both
 * ways to give are visible at once, so nobody has to click through to find
 * the bank details. Same destinations: the Paystack page, and the same
 * account and confirmation email.
 */
export function GiveButton({
  as,
  className,
  children,
}: {
  as: "individual" | "company" | "any";
  className: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] gap-0 rounded-2xl border-black/10 bg-white p-0 sm:max-w-lg dark:border-white/10 dark:bg-[#0b1414]">
          <DialogHeader className="px-6 pt-6 pb-4 text-left sm:px-8 sm:pt-8">
            <DialogTitle className="pr-8 text-[22px] leading-tight font-bold tracking-[-0.01em] text-[#111] dark:text-white">
              {as === "individual"
                ? "Give as an individual"
                : as === "company"
                  ? "Give as a company or organization"
                  : "Support the Mikaelson Initiative"}
            </DialogTitle>
            <DialogDescription className="mt-1 text-base leading-relaxed text-[#555] dark:text-white/60">
              Two ways to send your support. Pick whichever suits you.
            </DialogDescription>
          </DialogHeader>

          <div className="border-t border-black/10 px-6 py-5 sm:px-8 dark:border-white/10">
            <h3 className="text-[15px] font-semibold text-[#111] dark:text-white">Mobile payment</h3>
            <p className="mt-1 text-[15px] leading-relaxed text-[#555] dark:text-white/60">
              Pay online through Paystack. It opens in a new tab.
            </p>
            <a
              href={PAYSTACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn.primary} mt-4 w-full sm:w-auto`}
            >
              Pay with Paystack
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          <div className="rounded-b-2xl border-t border-black/10 bg-[#EEFCFC] px-6 py-5 sm:px-8 sm:pb-8 dark:border-white/10 dark:bg-white/[0.03]">
            <h3 className="text-[15px] font-semibold text-[#111] dark:text-white">Wire transfer</h3>
            <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-[15px]">
              <dt className="text-[#555] dark:text-white/60">Bank</dt>
              <dd className="font-medium text-[#111] dark:text-white">{WIRE.bank}</dd>
              <dt className="text-[#555] dark:text-white/60">Account name</dt>
              <dd className="font-medium break-words text-[#111] dark:text-white">{WIRE.accountName}</dd>
              <dt className="self-center text-[#555] dark:text-white/60">Account number</dt>
              <dd className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-semibold tracking-[0.04em] text-[#111] tabular-nums dark:text-white">
                  {WIRE.accountNumber}
                </span>
                <CopyButton value={WIRE.accountNumber} />
              </dd>
            </dl>
            <p className="mt-4 text-[15px] leading-relaxed text-[#555] dark:text-white/60">
              Then email your transfer confirmation to{" "}
              <a
                href={`mailto:${WIRE.confirmEmail}`}
                className="font-semibold break-all text-[#003E45] underline underline-offset-2 dark:text-[#5CE1E6]"
              >
                {WIRE.confirmEmail}
              </a>
              .
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** "Copy" → "Copied": both labels share one grid cell, so the pill never resizes. */
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  const label =
    "col-start-1 row-start-1 flex items-center gap-1.5 transition-[opacity,filter] duration-200 ease-[ease] motion-reduce:[filter:none]";

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-grid min-h-11 items-center rounded-full px-3 text-sm font-semibold text-[#003E45] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] motion-reduce:active:scale-100 dark:text-[#5CE1E6]"
    >
      <span className={`${label} ${copied ? "opacity-0 blur-[2px]" : "opacity-100"}`} aria-hidden={copied}>
        <Copy className="size-3.5" aria-hidden="true" />
        Copy
      </span>
      <span className={`${label} ${copied ? "opacity-100" : "opacity-0 blur-[2px]"}`} aria-hidden={!copied}>
        Copied
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Account number copied" : ""}
      </span>
    </button>
  );
}
