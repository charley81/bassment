"use server";

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || "BASSMENT <onboarding@resend.dev>";
const CONTACT_TO = process.env.RESEND_CONTACT_EMAIL || "hello@bassment.com";

interface NewsletterValues {
  email: string;
}

export async function subscribeNewsletter(
  values: NewsletterValues
): Promise<{ success: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured. Subscription not saved:", values.email);
    return { success: false, error: "Email service not configured." };
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: RESEND_FROM,
      to: CONTACT_TO,
      subject: "New Newsletter Subscription",
      text: `New subscriber: ${values.email}`,
    });
    return { success: true };
  } catch (err) {
    console.error("Resend newsletter error:", err);
    return { success: false, error: "Failed to subscribe. Please try again." };
  }
}
