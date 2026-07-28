"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { newsletterData } from "@/lib/data";
import { subscribeNewsletter } from "@/app/actions/newsletter";
import { toast } from "sonner";
import { useState } from "react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type FormValues = z.infer<typeof schema>;

export function NewsletterForm() {
  const [pending, setPending] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: FormValues) {
    setPending(true);
    try {
      const result = await subscribeNewsletter(values);
      if (result.success) {
        toast.success("Subscribed! Check your inbox.");
        form.reset();
      } else {
        toast.error(result.error || "Failed to subscribe. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const { errors } = form.formState;

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex gap-1 w-full">
        <FormField name="email" error={errors.email?.message} className="flex-1">
          <Input
            type="email"
            placeholder={newsletterData.placeholder}
            className="h-14 px-5 rounded-lg bg-bass-dark border border-bass-border text-nav text-bass-grey-med placeholder:text-bass-grey-med focus-visible:border-(--color-primary) focus-visible:ring-0"
            {...form.register("email")}
          />
          <FormMessage />
        </FormField>
        <button
          type="submit"
          disabled={pending}
          className="h-14 px-6 rounded-lg bg-(--color-primary) text-btn text-bass-white hover:bg-(--color-primary)/80 transition-colors shrink-0 disabled:opacity-50"
        >
          {pending ? "..." : newsletterData.cta}
        </button>
      </div>
      <p className="text-caption text-bass-grey-light mt-3 text-center">{newsletterData.disclaimer}</p>
    </Form>
  );
}
