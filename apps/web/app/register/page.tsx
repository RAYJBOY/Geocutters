"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StepOne } from "@/components/features/register/StepOne";
import { StepTwo } from "@/components/features/register/StepTwo";

const STEPS = ["Your info", "Service area", "Services", "Details"];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-card rounded-xl p-8 max-w-md text-center border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Application submitted!
          </h2>
          <p className="text-muted-foreground mb-6">
            We'll review your profile and email you within 48 hours.
          </p>
          <Button className="w-full">Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-12">
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          {STEPS.map((_, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;

            return (
              <div key={n} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? "✓" : n}
                </div>
                {n < STEPS.length && (
                  <div
                    className={`w-8 h-0.5 ${done ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground text-center">
          Step {step} of {STEPS.length}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-card border border-border rounded-xl p-6">
        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              Your details
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Let's start with some basic information.
            </p>
            <StepOne
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              onNext={handleNext}
            />
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              Service area
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              How far are you willing to travel?
            </p>
            <StepTwo onNext={handleNext} onBack={handleBack} />
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              Your services
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Add the services you offer.
            </p>
            <div className="flex gap-3 mt-8">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              About you
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Complete your profile.
            </p>
            <div className="flex gap-3 mt-8">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1 bg-primary">
                Submit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}