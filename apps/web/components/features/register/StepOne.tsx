import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type StepOneProps = {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  onNext: () => void | Promise<void>;
  isSubmitting: boolean;
  error: string;
};

export const StepOne = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onNext,
  isSubmitting,
  error,
}: StepOneProps) => {
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");
    await onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="form-name">Full name *</FieldLabel>
          <Input
            id="form-name"
            required
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="form-email">Email *</FieldLabel>
          <Input
            id="form-email"
            required
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="form-password">Password *</FieldLabel>
          <Input
            id="form-password"
            required
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="form-confirm-password">
            Repeat password *
          </FieldLabel>
          <Input
            id="form-confirm-password"
            required
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordError("");
            }}
            className="bg-background"
          />
          {passwordError && (
            <p className="text-sm text-destructive" role="alert">
              {passwordError}
            </p>
          )}
        </Field>

        <div className="flex gap-3 mt-8 pt-6 border-t border-border">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Sending verification email..." : "Continue"}
          </Button>
        </div>
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      </FieldGroup>
    </form>
  );
};