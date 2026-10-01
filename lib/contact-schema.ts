import { z } from "zod";
import { inquiryTypes } from "@/content/contact";

const inquiryValues = inquiryTypes.map((t) => t.value) as [
  (typeof inquiryTypes)[number]["value"],
  ...(typeof inquiryTypes)[number]["value"][],
];

/** Limits shared by the form (HTML attributes) and the server action (zod). */
export const contactLimits = {
  name: 100,
  organization: 120,
  messageMin: 20,
  messageMax: 5000,
} as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Please enter your name." })
    .max(contactLimits.name, { error: "That name is too long." }),
  email: z.email({ error: "Please enter a valid email address." }),
  organization: z
    .string()
    .trim()
    .max(contactLimits.organization, { error: "That's too long." })
    .optional(),
  inquiry: z.enum(inquiryValues, { error: "Please choose what this is about." }),
  message: z
    .string()
    .trim()
    .min(contactLimits.messageMin, {
      error: `Please write at least ${contactLimits.messageMin} characters.`,
    })
    .max(contactLimits.messageMax, { error: "That message is too long." }),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<ContactField, string>> }
  | { status: "success" }
  | { status: "error" }
  | { status: "unconfigured" };
