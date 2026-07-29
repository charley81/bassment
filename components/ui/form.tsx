"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FormFieldContextValue {
  name: string;
  error?: string;
}

const FormFieldContext = React.createContext<FormFieldContextValue>({ name: "" });

function Form({ children, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  return <form {...props}>{children}</form>;
}

function FormField({
  name,
  error,
  children,
  className,
}: {
  name: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <FormFieldContext.Provider value={{ name, error }}>
      <div className={cn("flex flex-col gap-2", className)}>{children}</div>
    </FormFieldContext.Provider>
  );
}

function FormLabel({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <Label className="text-sm font-bold uppercase text-bass-grey-med" {...props}>
      {children}
    </Label>
  );
}

function FormMessage({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { error } = React.useContext(FormFieldContext);
  if (!error) return null;
  return (
    <p className={cn("text-sm text-primary", className)} {...props}>
      {error}
    </p>
  );
}

export { Form, FormField, FormLabel, FormMessage };
