"use server";

import { z } from "zod";
import { getResend, RESEND_FROM } from "@/lib/resend";

const CONTACT_TO = process.env.RESEND_CONTACT_EMAIL || "hello@bassment.com";

// Server-side validation — client-side zod is UX, this is the real gate.
const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .refine((s) => !/[\r\n]/.test(s), "Invalid name"), // subject-line injection guard
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(5000),
  botField: z.string().max(0).optional(), // honeypot — must stay empty
});

interface ContactValues {
  name: string;
  email: string;
  message: string;
  botField?: string;
}

export async function sendContactMessage(
  values: ContactValues
): Promise<{ success: boolean; error?: string }> {
  const parsed = schema.safeParse(values);

  // Honeypot filled → bot. Pretend success so it doesn't adapt.
  if (values.botField) {
    return { success: true };
  }

  if (!parsed.success) {
    return { success: false, error: "Please check your input and try again." };
  }

  try {
    await getResend().emails.send({
      from: RESEND_FROM,
      to: CONTACT_TO,
      subject: `Contact: ${parsed.data.name}`,
      text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\nMessage:\n${parsed.data.message}`,
    });
    return { success: true };
  } catch (err) {
    console.error("Resend contact error:", err);
    return { success: false, error: "Failed to send. Please try again." };
  }
}
