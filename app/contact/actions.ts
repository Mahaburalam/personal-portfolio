"use server";

import { z } from "zod";
import { inquiryTypes } from "@/content/contact";
import { contactSchema, type ContactField, type ContactState } from "@/lib/contact-schema";

/**
 * Validates a contact inquiry and emails it to the owner through Resend's REST API.
 * Env: RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL (see .env.example).
 */
export async function sendInquiry(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field. Pretend success for bots.
  if (formData.get("website")) return { status: "success" };

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    organization: formData.get("organization") || undefined,
    inquiry: formData.get("inquiry"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    const errors: Partial<Record<ContactField, string>> = {};
    for (const [field, messages] of Object.entries(fieldErrors)) {
      if (messages?.[0]) errors[field as ContactField] = messages[0];
    }
    return { status: "invalid", errors };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return { status: "unconfigured" };

  const { name, email, organization, inquiry, message } = parsed.data;
  const inquiryLabel = inquiryTypes.find((t) => t.value === inquiry)?.label ?? inquiry;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `[${inquiryLabel}] ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Organization: ${organization ?? "—"}`,
          `Inquiry: ${inquiryLabel}`,
          "",
          message,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      console.error("Contact form: Resend responded", res.status, await res.text());
      return { status: "error" };
    }
    return { status: "success" };
  } catch (err) {
    console.error("Contact form: send failed", err);
    return { status: "error" };
  }
}
