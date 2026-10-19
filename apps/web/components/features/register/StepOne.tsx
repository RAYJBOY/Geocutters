import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type StepOneProps = {
  name: string;
  setName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  email: string;
  onNext: () => void | Promise<void>;
};

export const StepOne = ({
  name,
  setName,
  phone,
  setPhone,
  email,
  onNext,
}: StepOneProps) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onNext();
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="form-name">Business profile name *</FieldLabel>
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
          <FieldLabel htmlFor="form-email">Account email</FieldLabel>
          <Input
            id="form-email"
            type="email"
            value={email}
            readOnly
            className="bg-background"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="form-phone">Phone number (optional)</FieldLabel>
          <Input
            id="form-phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. 07123 456789"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="bg-background"
          />
        </Field>

        <div className="flex gap-3 mt-8 pt-6 border-t border-border">
          <Button type="submit" className="flex-1" disabled={!email}>
            Continue
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};