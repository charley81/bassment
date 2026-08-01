"use server";

import { z } from "zod";
import { groq } from "next-sanity";
import { clientUncached, getWriteClient } from "@/lib/sanity/client";
import { sendTicketEmail } from "@/lib/ticket-email";
import { normalizeEmail, resendAllowed } from "@/lib/tickets";

/* Self-serve ticket resend (spec: docs/ticket-resend/spec.md).
   Non-enumerating: the user-facing response is identical whether tickets
   exist, don't, or were recently resent. Throttle is durable via
   lastResentAt on the ticket docs — no in-memory state. */

const schema = z.object({
  email: z.string().trim().email().max(320),
  botField: z.string().max(0).optional(), // honeypot — must stay empty
});

const TICKETS_QUERY = groq`*[_type == "ticket" && email == $email] {
  _id, eventSlug, amount, orderRef, lastResentAt
}`;

interface TicketRow {
  _id: string;
  eventSlug: string;
  amount: number;
  orderRef: string;
  lastResentAt?: string;
}

export async function resendTickets(
  values: z.input<typeof schema>
): Promise<{ success: boolean; error?: string }> {
  // Honeypot filled → bot. Pretend success so it doesn't adapt.
  if (values.botField) {
    return { success: true };
  }

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const email = normalizeEmail(parsed.data.email);

  try {
    const tickets = await clientUncached.fetch<TicketRow[]>(TICKETS_QUERY, { email });

    if (tickets.length > 0) {
      if (!resendAllowed(tickets.map((t) => t.lastResentAt))) {
        // Generic success to the user — the throttle is none of a bot's business.
        console.log(`Resend throttled for ${email} (${tickets.length} ticket(s))`);
        return { success: true };
      }

      const sanity = getWriteClient();
      const now = new Date().toISOString();

      for (const ticket of tickets) {
        try {
          await sendTicketEmail(email, ticket.eventSlug, ticket.amount, ticket.orderRef);
          await sanity.patch(ticket._id).set({ lastResentAt: now }).commit();
          console.log(`Ticket ${ticket.orderRef} resent to ${email}`);
        } catch (err) {
          // Leave lastResentAt unset so a later attempt can retry this one.
          console.error(`Resend failed for ticket ${ticket.orderRef}:`, err);
        }
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Resend flow error:", err);
    return {
      success: false,
      error: "Something went wrong on our end — please use the contact form and we'll sort you out.",
    };
  }
}
