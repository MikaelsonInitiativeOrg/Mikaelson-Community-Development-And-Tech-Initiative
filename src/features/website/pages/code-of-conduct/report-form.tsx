"use client";

import { useState, type FormEvent } from "react";
import { Check, Mail, Send, ShieldCheck } from "lucide-react";
import { CONDUCT_EMAIL, REPORT_MAILTO } from "./content";

const INCIDENT_CATEGORIES = [
  "Harassment or Bullying",
  "Discrimination or Bias",
  "Inappropriate or Disrespectful Behavior",
  "Safety Hazard or Threat",
  "Academic or Leadership Misconduct",
  "Retaliation",
  "Other Code of Conduct Concern",
];

const inputClass =
  "h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-base text-white outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-white/45 focus:border-[#5CE1E6] focus:ring-2 focus:ring-[#5CE1E6]/25";

export function ConductReportForm() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [incident, setIncident] = useState(INCIDENT_CATEGORIES[0]);
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [partiesInvolved, setPartiesInvolved] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (details.trim().length < 15) {
      setError("Please provide at least 15 characters describing the incident.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/conduct/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incident,
          details,
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          date: date.trim() || undefined,
          partiesInvolved: partiesInvolved.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Unable to send your report. Please email us directly.");
      }
    } catch {
      setError("Network error. Please check your connection or email conduct@mikaelsoninitiative.org.");
    } finally {
      setBusy(false);
    }
  };

  if (success) {
    return (
      <div className="mt-8 rounded-2xl bg-white/10 p-6 ring-1 ring-[#5CE1E6]/40">
        <div className="flex items-center gap-2 font-bold text-[18px] text-[#5CE1E6]">
          <ShieldCheck className="size-6" />
          Report Confidentially Received
        </div>
        <p className="mt-3 text-base leading-relaxed text-white/90">
          Thank you for taking action to protect our community. Your report has been delivered directly and
          confidentially to the Code of Conduct review team.
        </p>
        {email && (
          <p className="mt-2 text-[14px] leading-relaxed text-white/75">
            An acknowledgment receipt has been sent to <strong>{email}</strong>.
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setSuccess(false);
            setOpen(false);
            setDetails("");
          }}
          className="mt-5 text-sm font-semibold text-[#5CE1E6] underline underline-offset-4 hover:text-white"
        >
          Submit another concern
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="mt-9 flex flex-col gap-3.5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#5CE1E6] px-6 text-[15px] font-bold text-[#050A0A] shadow-[0_4px_0_-1px_#002B30] transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#4BCDD2] active:scale-[0.97]"
        >
          <Send className="size-4" aria-hidden="true" />
          Submit confidential report online
        </button>

        <a
          href={REPORT_MAILTO}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition-[border-color,background-color] duration-150 hover:border-white hover:bg-white/5 active:scale-[0.97]"
        >
          <Mail className="size-4 shrink-0" aria-hidden="true" />
          Or email conduct team directly
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 flex flex-col gap-4 rounded-2xl bg-white/10 p-6 text-white ring-1 ring-white/15"
    >
      <div className="flex items-center justify-between border-b border-white/15 pb-3">
        <h3 className="text-[17px] font-bold text-[#5CE1E6]">Confidential Report Form</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs font-semibold text-white/70 underline hover:text-white"
        >
          Close
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-white/90">Incident Category</label>
        <select
          value={incident}
          onChange={(e) => setIncident(e.target.value)}
          className={`${inputClass} cursor-pointer`}
        >
          {INCIDENT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-[#003E45] text-white">
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-white/90">Description of What Happened *</label>
        <textarea
          required
          rows={4}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Please describe the incident, including context, words spoken, or actions observed..."
          className="w-full rounded-xl border border-white/20 bg-white/10 p-3.5 text-base text-white outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-white/45 focus:border-[#5CE1E6] focus:ring-2 focus:ring-[#5CE1E6]/25"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-white/90">Your Name (Optional)</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Leave blank to remain anonymous"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-white/90">Your Email (Optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="For receipt & follow-up"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-white/90">Date / Time (Optional)</label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="e.g. Yesterday morning"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-white/90">Parties Involved (Optional)</label>
          <input
            value={partiesInvolved}
            onChange={(e) => setPartiesInvolved(e.target.value)}
            placeholder="Names or club chapter"
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-950/50 p-3 text-xs text-red-200 ring-1 ring-red-400/30">{error}</div>
      )}

      <div className="mt-2 flex flex-wrap gap-2.5">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#5CE1E6] px-5 text-sm font-bold text-[#050A0A] hover:bg-[#4BCDD2] disabled:opacity-50"
        >
          <Check className="size-4" />
          {busy ? "Submitting confidentially…" : "Send confidential report"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-xs font-semibold text-white/70 hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
