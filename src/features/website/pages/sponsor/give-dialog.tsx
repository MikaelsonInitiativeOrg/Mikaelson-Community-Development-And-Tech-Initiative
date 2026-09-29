"use client";

import { useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { ArrowUpRight, Building2, Check, Copy, HeartHandshake, Lock, Mail, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { BANK_ACCOUNTS, CONFIRM_EMAIL, PARTNER_EMAIL, PAYSTACK_URL } from "./data";
import styles from "./give-dialog.module.css";

/**
 * The "give" popup.
 *
 * - Individuals give by bank transfer: both accounts (First Bank, GTBank)
 *   as cards with one-tap copy, and a ready-made confirmation email.
 * - Organisations pay online: a short form (organisation, contact, email,
 *   amount) posts to /api/paystack/initialize, which starts a Paystack
 *   transaction with the secret key on the server and returns Paystack's
 *   checkout URL; the browser goes there, and Paystack sends them back to
 *   /sponsor/thank-you, which verifies the payment. If online payment
 *   isn't set up, the form offers the Paystack payment page instead.
 * - Buttons that don't say who is giving ("any") get a two-way switch.
 *
 * The switch is a real tablist (arrow keys, sliding highlight: 220ms,
 * strong ease-out; instant from the keyboard and under reduced motion).
 */

type Who = "individual" | "company";

const TITLES = {
  individual: "Give as an individual",
  company: "Give as a company or organization",
  any: "Support the Mikaelson Initiative",
} as const;

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
  const [who, setWho] = useState<Who>(as === "company" ? "company" : "individual");
  const [instant, setInstant] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const shown: Who = as === "any" ? who : as;

  const pick = (w: Who, fromKeyboard = false) => {
    setInstant(fromKeyboard);
    setWho(w);
  };

  const onTabKey = (e: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const next: Who =
      e.key === "Home" ? "individual" : e.key === "End" ? "company" : who === "individual" ? "company" : "individual";
    pick(next, true);
    tabs.current[next === "individual" ? 0 : 1]?.focus();
  };

  const tab = (w: Who, i: number, icon: ReactNode, label: string) => (
    <button
      key={w}
      ref={(el) => {
        tabs.current[i] = el;
      }}
      type="button"
      role="tab"
      id={`give-tab-${w}`}
      aria-selected={who === w}
      aria-controls={`give-panel-${w}`}
      tabIndex={who === w ? 0 : -1}
      onClick={() => pick(w)}
      className={`relative z-10 inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-4 text-[15px] font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7] ${
        who === w ? "text-[#050A0A]" : "text-[#003E45]/70 hover:text-[#003E45] dark:text-white/60 dark:hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (o) {
            setInstant(true);
            setWho(as === "company" ? "company" : "individual");
          }
        }}
      >
        <DialogContent
          className={`${styles.dialog} max-h-[calc(100svh-2rem)] max-w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-3xl border-0 bg-white p-0 shadow-[0_40px_100px_-40px_rgb(0_62_69/0.55)] sm:max-w-[520px] dark:bg-[#0b1414] dark:ring-1 dark:ring-white/10`}
        >
          {/* Header: warm tint, a heart and the title. */}
          <div className="rounded-t-3xl bg-[#EEFCFC] px-6 pt-7 pb-6 sm:px-8 dark:bg-[#5CE1E6]/[0.07]">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#003E45] text-[#5CE1E6] dark:bg-[#5CE1E6] dark:text-[#003E45]">
              <HeartHandshake className="size-6" aria-hidden="true" />
            </span>
            <DialogTitle className="mt-4 pr-8 text-[24px] leading-tight font-bold tracking-[-0.015em] text-[#003E45] dark:text-white">
              {TITLES[as]}
            </DialogTitle>
            <DialogDescription className="mt-2 text-[15px] leading-relaxed text-[#555] dark:text-white/65">
              {shown === "individual"
                ? "Thank you for standing beside young people across Africa. Give by bank transfer to either account."
                : "Thank you for standing beside young people across Africa. Pay securely online with Paystack."}
            </DialogDescription>

            {as === "any" && (
              <div
                role="tablist"
                aria-label="Who is giving?"
                onKeyDown={onTabKey}
                className="relative mt-6 flex rounded-full bg-white p-1 ring-1 ring-[#003E45]/10 dark:bg-white/5 dark:ring-white/10"
              >
                <span
                  aria-hidden="true"
                  className={`${styles.thumb} absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-[#5CE1E6] shadow-[0_4px_12px_-6px_rgb(0_62_69/0.5)]`}
                  data-at={who === "company" ? "transfer" : "online"}
                  data-instant={instant || undefined}
                />
                {tab("individual", 0, <User className="size-4" aria-hidden="true" />, "Individual")}
                {tab("company", 1, <Building2 className="size-4" aria-hidden="true" />, "Organisation")}
              </div>
            )}
          </div>

          <div
            role={as === "any" ? "tabpanel" : undefined}
            id={`give-panel-${shown}`}
            aria-labelledby={as === "any" ? `give-tab-${shown}` : undefined}
            key={shown}
            className={`${styles.panel} px-6 py-6 sm:px-8 sm:pb-8`}
          >
            {shown === "individual" ? <BankTransfer /> : <OrganisationPayment />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ------------------------------------------------------ Individuals */

function BankTransfer() {
  return (
    <>
      <div className="flex flex-col gap-3">
        {BANK_ACCOUNTS.map((a) => (
          <div key={a.accountNumber} className="relative overflow-hidden rounded-2xl bg-[#003E45] p-5 text-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full bg-[radial-gradient(closest-side,rgb(92_225_230/0.3),transparent)]"
            />
            <p className="relative text-[13px] font-semibold text-[#5CE1E6]">{a.bank}</p>
            <div className="relative mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[24px] font-bold tracking-[0.08em] tabular-nums">{a.accountNumber}</span>
              <CopyButton value={a.accountNumber} label={`${a.bank} account number`} />
            </div>
            <p className="relative mt-2 text-[14px] leading-snug text-white/80">{a.accountName}</p>
          </div>
        ))}
      </div>

      <p className="mt-5 text-[15px] leading-relaxed text-[#555] dark:text-white/65">
        When you&rsquo;ve sent it, email us your transfer confirmation so we can thank you properly.
      </p>
      <a
        href={`mailto:${CONFIRM_EMAIL}?subject=${encodeURIComponent("Transfer confirmation: my gift to the Mikaelson Initiative")}`}
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#003E45]/25 px-6 text-base font-semibold text-[#003E45] transition-[transform,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-[#003E45] active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7] dark:border-white/25 dark:text-white dark:hover:border-white"
      >
        <Mail className="size-4" aria-hidden="true" />
        Email my confirmation
      </a>
      <p className="mt-3 text-center text-[13px] break-all text-[#555] dark:text-white/55">{CONFIRM_EMAIL}</p>
    </>
  );
}

/* ---------------------------------------------------- Organisations */

const SUGGESTED = [50_000, 100_000, 250_000, 500_000];

const inputClass =
  "h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-base text-[#111] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#777] focus:border-[#0097A7] focus:ring-2 focus:ring-[#0097A7]/25 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/45";

function OrganisationPayment() {
  const id = useId();
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallback, setFallback] = useState(false);

  const naira = Number(amount.replace(/[^\d]/g, ""));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    if (!naira || naira < 1000) {
      setError("Please enter an amount of at least ₦1,000.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization: String(form.get("organization") ?? ""),
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          amount: naira,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      if (res.status === 503) setFallback(true);
      setError(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("We couldn't reach the payment service. Check your connection and try again.");
    }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-org`} className="text-[14px] font-semibold text-[#111] dark:text-white">
          Organisation name
        </label>
        <input id={`${id}-org`} name="organization" required minLength={2} autoComplete="organization" className={inputClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-name`} className="text-[14px] font-semibold text-[#111] dark:text-white">
            Your name
          </label>
          <input id={`${id}-name`} name="name" required minLength={2} autoComplete="name" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-email`} className="text-[14px] font-semibold text-[#111] dark:text-white">
            Email for the receipt
          </label>
          <input id={`${id}-email`} name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-[14px] font-semibold text-[#111] dark:text-white">Amount (₦)</legend>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED.map((n) => {
            const on = naira === n;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={on}
                onClick={() => setAmount(String(n))}
                className={`min-h-11 rounded-full px-4 text-[14px] font-semibold tabular-nums transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7] ${
                  on
                    ? "bg-[#003E45] text-white dark:bg-[#5CE1E6] dark:text-[#050A0A]"
                    : "bg-[#EEFCFC] text-[#003E45] hover:bg-[#E0F7F8] dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                }`}
              >
                ₦{n.toLocaleString("en-NG")}
              </button>
            );
          })}
        </div>
        <label htmlFor={`${id}-amount`} className="sr-only">
          Or enter another amount in naira
        </label>
        <input
          id={`${id}-amount`}
          inputMode="numeric"
          placeholder="Or enter another amount"
          value={naira ? naira.toLocaleString("en-NG") : amount}
          onChange={(e) => setAmount(e.target.value)}
          className={`${inputClass} tabular-nums`}
        />
      </fieldset>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-[#B42318]/30 bg-[#FEF3F2] px-4 py-3 text-[14px] leading-relaxed text-[#912018] dark:border-[#FDA29B]/30 dark:bg-[#FDA29B]/10 dark:text-[#FECDCA]"
        >
          {error}
          {fallback && (
            <>
              {" "}
              <a href={PAYSTACK_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                Use our Paystack payment page instead
              </a>
              .
            </>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#5CE1E6] px-6 text-base font-bold text-[#050A0A] shadow-[0_8px_0_-2px_#003E45] transition-[translate,box-shadow,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:translate-y-[2px] hover:shadow-[0_5px_0_-2px_#003E45] active:translate-y-[6px] active:shadow-[0_1px_0_-2px_#003E45] disabled:cursor-default disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7]"
      >
        {busy ? "Opening secure checkout…" : naira >= 1000 ? `Pay ₦${naira.toLocaleString("en-NG")} with Paystack` : "Continue to Paystack"}
        {!busy && <ArrowUpRight className="size-4" aria-hidden="true" />}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-[13px] text-[#555] dark:text-white/55">
        <Lock className="size-3.5" aria-hidden="true" />
        Secured by Paystack. Your receipt comes by email.
      </p>
      <p className="border-t border-black/10 pt-4 text-[14px] leading-relaxed text-[#555] dark:border-white/10 dark:text-white/60">
        Thinking of a longer partnership? Write to{" "}
        <a
          href={`mailto:${PARTNER_EMAIL}`}
          className="font-semibold break-all text-[#003E45] underline underline-offset-2 dark:text-[#5CE1E6]"
        >
          {PARTNER_EMAIL}
        </a>
        .
      </p>
    </form>
  );
}

/** "Copy" → "Copied": both labels share one grid cell, so the pill never resizes. */
function CopyButton({ value, label }: { value: string; label: string }) {
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

  const face =
    "col-start-1 row-start-1 flex items-center gap-1.5 transition-[opacity,filter] duration-200 ease-[ease] motion-reduce:[filter:none]";

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="inline-grid min-h-11 items-center rounded-full bg-white/10 px-4 text-sm font-semibold text-white transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/15 active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5CE1E6]"
    >
      <span className={`${face} ${copied ? "opacity-0 blur-[2px]" : "opacity-100"}`} aria-hidden="true">
        <Copy className="size-3.5" />
        Copy
      </span>
      <span className={`${face} text-[#5CE1E6] ${copied ? "opacity-100" : "opacity-0 blur-[2px]"}`} aria-hidden="true">
        <Check className="size-3.5" />
        Copied
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? `${label} copied` : ""}
      </span>
    </button>
  );
}
