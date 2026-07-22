"use server";

import { Resend } from "resend";

interface ContactValues {
  name: string;
  email: string;
  message: string;
}

export async function sendContactMessage(
  values: ContactValues
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured. Message not sent:", values.email);
    return { success: false, error: "Email service not configured." };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "BASSMENT <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "hello@bassment.com",
      subject: `Contact: ${values.name}`,
      text: `Name: ${values.name}\nEmail: ${values.email}\n\nMessage:\n${values.message}`,
    });
    return { success: true };
  } catch (err) {
    console.error("Resend contact error:", err);
    return { success: false, error: "Failed to send. Please try again." };
  }
}
