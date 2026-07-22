"use server";

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || "BASSMENT <onboarding@resend.dev>";
const CONTACT_TO = process.env.RESEND_CONTACT_EMAIL || "hello@bassment.com";

interface ContactValues {
  name: string;
  email: string;
  message: string;
}

export async function sendContactMessage(
  values: ContactValues
): Promise<{ success: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured. Message not sent:", values.email);
    return { success: false, error: "Email service not configured." };
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: RESEND_FROM,
      to: CONTACT_TO,
      subject: `Contact: ${values.name}`,
      text: `Name: ${values.name}\nEmail: ${values.email}\n\nMessage:\n${values.message}`,
    });
    return { success: true };
  } catch (err) {
    console.error("Resend contact error:", err);
    return { success: false, error: "Failed to send. Please try again." };
  }
}
