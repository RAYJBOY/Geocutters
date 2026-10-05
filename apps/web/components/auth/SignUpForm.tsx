"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { MailCheck, RefreshCw } from "lucide-react";
import { useState } from "react";

export const SignUpForm = () => {
  const [error, setError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = getSupabaseBrowserClient();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");
      const name = String(formData.get("name") ?? "").trim();

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        setError(
          error.status === 429
            ? "Supabase is temporarily limiting sign-ups. Please wait before trying again."
            : "We couldn't create your account. Please check your details and try again.",
        );
        return;
      }
      setSubmittedEmail(email);
      setHasSubmitted(true);
    } catch {
      setError("We couldn't create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    setIsResending(true);
    setResendMessage("");

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: submittedEmail,
      });

      setResendMessage(
        error
          ? "We couldn't resend the email. Please try again."
          : "A new confirmation email is on its way.",
      );
    } catch {
      setResendMessage("We couldn't resend the email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (hasSubmitted) {
    return (
      <section
        className="mx-auto flex w-full max-w-md flex-col items-center px-2 py-6 text-center"
        aria-live="polite"
      >
        <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck aria-hidden="true" className="size-7" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          Check your inbox
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          We sent a confirmation link to{" "}
          <span className="font-medium text-foreground">{submittedEmail}</span>.
          Open the email and follow the link to finish creating your account.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={handleResendConfirmation}
          disabled={isResending}
        >
          <RefreshCw
            aria-hidden="true"
            className={isResending ? "animate-spin" : ""}
          />
          {isResending ? "Sending..." : "Resend confirmation email"}
        </Button>
        {resendMessage && (
          <p className="mt-3 text-sm text-muted-foreground" role="status">
            {resendMessage}
          </p>
        )}
      </section>
    );
  }

  return (
    <form
      className="w-full max-w-md space-y-4 rounded-xl p-2"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Create your account
        </h2>
        <p className="text-sm text-muted-foreground">Sign up to get started.</p>
      </div>

      <div>
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Smith"
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className="mt-1"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          className="mt-1"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Sign up"}
      </Button>
    </form>
  );
};
