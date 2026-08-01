"use server";

import { z } from "zod";
import { getResend, RESEND_FROM } from "@/lib/resend";

const CONTACT_TO = process.env.RESEND_CONTACT_EMAIL || "hello@bassment.com";

const schema = z.object({
  email: z.string().trim().email().max(200),
  botField: z.string().max(0).optional(), // honeypot — must stay empty
});

interface NewsletterValues {
  email: string;
  botField?: string;
}

export async function subscribeNewsletter(
  values: NewsletterValues
): Promise<{ success: boolean; error?: string }> {
  // Honeypot filled → bot. Pretend success so it doesn't adapt.
  if (values.botField) {
    return { success: true };
  }

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    await getResend().emails.send({
      from: RESEND_FROM,
      to: CONTACT_TO,
      subject: "New Newsletter Subscription",
      text: `New subscriber: ${parsed.data.email}`,
    });
    return { success: true };
  } catch (err) {
    console.error("Resend newsletter error:", err);
    return { success: false, error: "Failed to subscribe. Please try again." };
  }
}
