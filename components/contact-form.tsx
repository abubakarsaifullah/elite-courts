"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteContent } from "@/data/siteContent";

interface FormState {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
}

const initialState: FormState = { status: "idle", message: "" };

export function ContactForm() {
  const [state, setState] = useState<FormState>(initialState);
  const labels = siteContent.forms.contact.labels;
  const placeholders = siteContent.forms.contact.placeholders;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
      website: String(formData.get("website") || ""),
    };

    setState({ status: "submitting", message: "Sending your message..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok) {
        throw new Error(data.message || "We could not send your message right now.");
      }

      setState({
        status: "success",
        message: data.message || siteContent.forms.contact.successFallback,
      });
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : siteContent.forms.contact.errorFallback;
      setState({ status: "error", message });
    }
  }

  return (
    <Card>
      <CardContent>
        <form id="elite-contact-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-[color:var(--muted-strong)]">
                {labels.name}
              </label>
              <Input id="name" name="name" autoComplete="name" required placeholder={placeholders.name} />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[color:var(--muted-strong)]">
                {labels.email}
              </label>
              <Input id="email" name="email" type="email" autoComplete="email" required placeholder={placeholders.email} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-[color:var(--muted-strong)]">
                {labels.phone}
              </label>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" required placeholder={placeholders.phone} />
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-[color:var(--muted-strong)]">
                {labels.subject}
              </label>
              <Input id="subject" name="subject" required placeholder={placeholders.subject} />
            </div>
          </div>

          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-[color:var(--muted-strong)]">
              {labels.message}
            </label>
            <Textarea id="message" name="message" required placeholder={placeholders.message} />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" className="w-full sm:w-auto" disabled={state.status === "submitting"} aria-busy={state.status === "submitting"}>
              <Send className="h-4 w-4" />
              {state.status === "submitting" ? labels.submitting : labels.submit}
            </Button>
            {state.message ? (
              <p
                aria-live="polite"
                className={
                  state.status === "success"
                    ? "text-sm text-emerald-500"
                    : state.status === "error"
                      ? "text-sm text-rose-500"
                      : "text-sm text-[color:var(--muted)]"
                }
              >
                {state.message}
              </p>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
