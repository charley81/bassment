"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { sendContactMessage } from "@/app/actions/contact";
import { toast } from "sonner";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", message: "" },
  });

  async function onSubmit(values: FormValues) {
    setPending(true);
    try {
      const result = await sendContactMessage(values);
      if (result.success) {
        toast.success("Message sent! We'll get back to you soon.");
        form.reset();
      } else {
        toast.error(result.error || "Failed to send. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const { errors } = form.formState;

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <FormField name="name" error={errors.name?.message}>
        <FormLabel>Full Name</FormLabel>
        <Input
          placeholder="John Doe"
          className="h-52 px-4 rounded-lg bg-bass-dark border border-bass-grey-med text-nav placeholder:text-bass-grey-med focus-visible:border-primary focus-visible:ring-0"
          {...form.register("name")}
        />
        <FormMessage />
      </FormField>

      <FormField name="email" error={errors.email?.message}>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="john@example.com"
          className="h-52 px-4 rounded-lg bg-bass-dark border border-bass-grey-med text-nav placeholder:text-bass-grey-med focus-visible:border-primary focus-visible:ring-0"
          {...form.register("email")}
        />
        <FormMessage />
      </FormField>

      <FormField name="message" error={errors.message?.message}>
        <FormLabel>Message</FormLabel>
        <Textarea
          placeholder="Tell us how we can help..."
          className="min-h-40 p-4 rounded-lg bg-bass-dark border border-bass-grey-med text-nav placeholder:text-bass-grey-med focus-visible:border-primary focus-visible:ring-0 resize-none"
          {...form.register("message")}
        />
        <FormMessage />
      </FormField>

      <button
        type="submit"
        disabled={pending}
        className="h-14 rounded-md bg-primary text-btn text-bass-white hover:bg-primary/80 transition-colors disabled:opacity-50"
      >
        {pending ? "SENDING..." : "SUBMIT"}
      </button>
    </Form>
  );
}
