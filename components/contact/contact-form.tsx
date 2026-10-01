"use client";

import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { sendInquiry } from "@/app/contact/actions";
import { buttonVariants } from "@/components/ui/button";
import { formCopy, inquiryTypes } from "@/content/contact";
import { contactLimits, type ContactField, type ContactState } from "@/lib/contact-schema";
import { bookingUrl, profile } from "@/lib/site";
import { cn } from "@/lib/utils";

const initialState: ContactState = { status: "idle" };

const fieldOrder: ContactField[] = ["name", "email", "organization", "inquiry", "message"];

const control =
  "w-full rounded-md border bg-background px-4 py-3 text-base transition-colors duration-200 placeholder:text-muted-foreground/60 hover:border-foreground/30 aria-invalid:border-destructive";

type FieldProps = {
  id: ContactField;
  label: string;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
};

function Field({ id, label, required, error, hint, className, children }: FieldProps) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="label-mono text-muted-foreground">
          {label}
          {required && <span aria-hidden> *</span>}
        </label>
        {hint}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendInquiry, initialState);
  const [messageLength, setMessageLength] = useState(0);
  const [dismissed, setDismissed] = useState<ContactState | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  // Time-trap: stamp when the form appeared (after mount, so SSR markup stays stable).
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  const errors = state.status === "invalid" ? state.errors : {};
  const describedBy = (field: ContactField) => (errors[field] ? `${field}-error` : undefined);

  // Move focus to the first invalid field after a failed submit.
  useEffect(() => {
    if (state.status !== "invalid") return;
    const first = fieldOrder.find((f) => state.errors[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }, [state]);

  // Submit via a transition so React doesn't reset the fields when the server returns errors.
  // The `action` attribute stays for no-JS progressive enhancement.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  };

  if (state.status === "success" && dismissed !== state) {
    return (
      <div role="status" className="flex flex-col items-start gap-6 py-10">
        <CheckCircle2 aria-hidden className="size-8 text-signal" />
        <p className="max-w-md font-display text-2xl font-semibold tracking-tight">
          {formCopy.success}
        </p>
        <button
          type="button"
          onClick={() => {
            setDismissed(state);
            setMessageLength(0);
          }}
          className={buttonVariants({ variant: "outline" })}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      aria-describedby="form-status"
      className="grid gap-6 sm:grid-cols-2"
    >
      <Field id="name" label="Name" required error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={contactLimits.name}
          placeholder="Your name"
          aria-invalid={!!errors.name || undefined}
          aria-describedby={describedBy("name")}
          className={control}
        />
      </Field>

      <Field id="email" label="Email" required error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          aria-invalid={!!errors.email || undefined}
          aria-describedby={describedBy("email")}
          className={control}
        />
      </Field>

      <Field
        id="organization"
        label="Organization"
        error={errors.organization}
        className="sm:col-span-2"
      >
        <input
          id="organization"
          name="organization"
          type="text"
          autoComplete="organization"
          maxLength={contactLimits.organization}
          placeholder="Company, lab or university — optional"
          aria-invalid={!!errors.organization || undefined}
          aria-describedby={describedBy("organization")}
          className={control}
        />
      </Field>

      <fieldset
        className="sm:col-span-2"
        aria-invalid={!!errors.inquiry || undefined}
        aria-describedby={describedBy("inquiry")}
      >
        <legend className="label-mono mb-3 text-muted-foreground">
          What is this about<span aria-hidden> *</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {inquiryTypes.map((type) => (
            <label key={type.value} className="cursor-pointer">
              <input
                type="radio"
                name="inquiry"
                value={type.value}
                required
                className="peer sr-only"
              />
              <span className="inline-flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors duration-200 peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring hover:border-foreground/30">
                {type.label}
              </span>
            </label>
          ))}
        </div>
        {errors.inquiry && (
          <p id="inquiry-error" className="mt-2 text-sm text-destructive">
            {errors.inquiry}
          </p>
        )}
      </fieldset>

      <Field
        id="message"
        label="Message"
        required
        error={errors.message}
        className="sm:col-span-2"
        hint={
          <span className="label-mono text-muted-foreground/70 tabular-nums" aria-hidden>
            {messageLength}/{contactLimits.messageMax}
          </span>
        }
      >
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          minLength={contactLimits.messageMin}
          maxLength={contactLimits.messageMax}
          placeholder={formCopy.messagePlaceholder}
          onChange={(e) => setMessageLength(e.target.value.length)}
          aria-invalid={!!errors.message || undefined}
          aria-describedby={describedBy("message")}
          className={cn(control, "min-h-40 resize-y")}
        />
      </Field>

      {/* Honeypot — hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />

      <div className="flex flex-col gap-6 sm:col-span-2">
        <div id="form-status" role="status" aria-live="polite">
          {state.status === "error" && (
            <p className="text-sm text-destructive">
              {formCopy.error}{" "}
              <a href={`mailto:${profile.email}`} className="underline underline-offset-4">
                {profile.email}
              </a>
            </p>
          )}
          {state.status === "unconfigured" && (
            <p className="text-sm text-muted-foreground">
              {formCopy.unconfigured}{" "}
              <a
                href={`mailto:${profile.email}`}
                className="text-foreground underline underline-offset-4"
              >
                {profile.email}
              </a>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={pending} className={buttonVariants()}>
            {pending ? "Sending…" : "Send message"}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
            />
          </button>
          {bookingUrl && (
            <a
              href={bookingUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              Book a short intro call
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          )}
          <p className="label-mono text-muted-foreground/80 sm:ml-auto">{formCopy.note}</p>
        </div>
      </div>
    </form>
  );
}
