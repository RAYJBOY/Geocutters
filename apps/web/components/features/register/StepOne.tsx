import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type StepOneProps = {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  onNext: () => void;
};

export const StepOne = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  onNext,
}: StepOneProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext();
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
          <FieldLabel htmlFor="form-phone">Phone *</FieldLabel>
          <Input
            id="form-phone"
            required
            type="tel"
            placeholder="+44 01234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-background"
          />
        </Field>

        <div className="flex gap-3 mt-8 pt-6 border-t border-border">
          <Button type="submit" className="flex-1">
            Continue
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};