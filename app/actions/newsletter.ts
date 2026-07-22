"use server";

import { Resend } from "resend";

interface NewsletterValues {
  email: string;
}

export async function subscribeNewsletter(
  values: NewsletterValues
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured. Subscription not saved:", values.email);
    return { success: false, error: "Email service not configured." };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "BASSMENT <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "hello@bassment.com",
      subject: "New Newsletter Subscription",
      text: `New subscriber: ${values.email}`,
    });
    return { success: true };
  } catch (err) {
    console.error("Resend newsletter error:", err);
    return { success: false, error: "Failed to subscribe. Please try again." };
  }
}
