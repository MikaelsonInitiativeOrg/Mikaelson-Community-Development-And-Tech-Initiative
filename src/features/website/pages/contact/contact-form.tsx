"use client";

import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MailCheck } from "lucide-react";
import { EnvelopeSend, useEnvelopeSend } from "@/components/site/envelope-send";
import { Field, describedBy, inputClass } from "./field";
import { btn } from "./styles";

// The site has no mail backend, so sending opens the visitor's own email app
// with the letter already written, addressed to the partnership inbox. The
// note afterwards says so plainly (it never claims we received it). To send
// from the page instead, add an API route and call it in onSubmit.
export const CONTACT_EMAIL = "partnership@mikaelsoninitiative.org";
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email, like name@example.com."),
  subject: z.string().min(3, "Add a subject of at least 3 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * The form is drawn as a letter: addressed at the top, signed by the name
 * and email fields. Sending folds it into the envelope (EnvelopeSend), and
 * the note only replaces it after the envelope has flown.
 */
export function ContactForm() {
  const [sendError, setSendError] = useState<string | null>(null);
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null);
  const { status, run } = useEnvelopeSend();
  const doneRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
    mode: "onTouched",
  });

  const message = useWatch({ control, name: "message" }) ?? "";
  const busy = status !== "idle";

  const onSubmit = handleSubmit(async (values) => {
    setSendError(null);
    const ok = await run(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "We couldn't deliver your message right now.");
        }
        return true;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : `We couldn't reach the server. Please write to us directly at ${CONTACT_EMAIL}.`;
        setSendError(msg);
        return false;
      }
    });
    if (ok) {
      setSent({ name: values.name.split(" ")[0], email: values.email });
      setTimeout(() => doneRef.current?.focus(), 0);
    }
  });

  if (sent) {
    return (
      <div className="flex min-h-[420px] flex-col items-start justify-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-[#EEFCFC] text-[#003E45] dark:bg-[#003E45] dark:text-[#5CE1E6]">
          <MailCheck className="size-6" aria-hidden="true" />
        </span>
        <h2
          ref={doneRef}
          tabIndex={-1}
          className="mt-6 text-[26px] leading-tight font-bold tracking-[-0.015em] text-[#111] outline-none dark:text-white"
        >
          Your letter has been sent
        </h2>
        <p className="mt-3 max-w-[46ch] text-[17px] leading-[1.65] text-[#555] dark:text-white/65">
          Thank you, {sent.name}. We have received your message safely. A confirmation copy has been sent to{" "}
          <strong className="font-semibold text-[#111] dark:text-white">{sent.email}</strong>. Our team is reviewing
          your letter and will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            reset();
            setSent(null);
          }}
          className={`${btn.outline} mt-8`}
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby="letter-heading">
      <h2 id="letter-heading" className="text-[15px] font-semibold text-[#555] dark:text-white/60">
        To the Mikaelson Initiative
      </h2>

      <div className="mt-6 flex flex-col gap-5">
        <Field id="c-subject" label="Subject" error={errors.subject?.message}>
          <input
            id="c-subject"
            placeholder="What's it about?"
            className={`${inputClass} h-12`}
            aria-invalid={!!errors.subject}
            aria-describedby={describedBy("c-subject", { error: !!errors.subject })}
            {...register("subject")}
          />
        </Field>

        <Field id="c-message" label="Message" error={errors.message?.message}>
          <textarea
            id="c-message"
            rows={7}
            placeholder="Dear Mikaelson Initiative,"
            className={`${inputClass} min-h-44 py-3 leading-[1.65]`}
            aria-invalid={!!errors.message}
            aria-describedby={describedBy("c-message", { hint: true, error: !!errors.message })}
            {...register("message")}
          />
          <p id="c-message-hint" className="text-sm text-[#555] tabular-nums dark:text-white/55">
            {message.length < 10 ? `At least 10 characters (${message.length}/10)` : "Looks good"}
          </p>
        </Field>

        {/* Signed by: the sender's details, like the foot of a letter. */}
        <div className="grid gap-5 border-t border-dashed border-black/15 pt-5 sm:grid-cols-2 dark:border-white/15">
          <Field id="c-name" label="Your name" error={errors.name?.message}>
            <input
              id="c-name"
              autoComplete="name"
              className={`${inputClass} h-12`}
              aria-invalid={!!errors.name}
              aria-describedby={describedBy("c-name", { error: !!errors.name })}
              {...register("name")}
            />
          </Field>
          <Field id="c-email" label="Your email" error={errors.email?.message}>
            <input
              id="c-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="your.email@example.com"
              className={`${inputClass} h-12`}
              aria-invalid={!!errors.email}
              aria-describedby={describedBy("c-email", { error: !!errors.email })}
              {...register("email")}
            />
          </Field>
        </div>
      </div>

      {sendError && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-[#B42318]/30 bg-[#FEF3F2] px-4 py-3 text-[15px] leading-relaxed text-[#912018] dark:border-[#FDA29B]/30 dark:bg-[#FDA29B]/10 dark:text-[#FECDCA]"
        >
          {sendError}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <EnvelopeSend status={status}>
          <button type="submit" disabled={busy} aria-disabled={busy} className={`${btn.primary} disabled:cursor-default`}>
            {busy ? "Sending your letter…" : "Send message"}
          </button>
        </EnvelopeSend>
      </div>
    </form>
  );
}
