import type { ReactNode } from "react";

// Inputs at 16px on every screen (iOS zooms anything smaller), 48px tall,
// named transitions only.
export const inputClass =
  "block w-full min-w-0 rounded-xl border border-black/15 bg-white px-4 text-base text-[#111] placeholder:text-[#8a8a8a] outline-none " +
  "transition-[border-color,box-shadow] duration-150 ease-[ease] focus:border-[#0097A7] focus:ring-[3px] focus:ring-[#5CE1E6]/45 " +
  "aria-[invalid=true]:border-[#B42318] aria-[invalid=true]:focus:ring-[#B42318]/20 " +
  "dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/35 dark:aria-[invalid=true]:border-[#FDA29B]";

/** Label, control, hint and error, wired together for screen readers. */
export function Field({
  id,
  label,
  hint,
  error,
  optional = false,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[15px] font-semibold text-[#111] dark:text-white">
        {label}
        {optional && <span className="ml-1.5 font-normal text-[#555] dark:text-white/50">(optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="-mt-1 text-sm leading-relaxed text-[#555] dark:text-white/55">
          {hint}
        </p>
      )}
      {children}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-2 text-sm leading-snug font-medium text-[#B42318] dark:text-[#FDA29B]">
      <span aria-hidden="true" className="mt-[3px] size-2.5 shrink-0 rounded-[3px] bg-current" />
      {children}
    </p>
  );
}

/** aria-describedby for a field: its hint and, when present, its error. */
export function describedBy(id: string, { hint, error }: { hint?: boolean; error?: boolean }) {
  const ids = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}
