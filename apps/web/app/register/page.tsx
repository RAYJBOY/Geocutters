"use client";

import { useState } from "react";
import type { RegistrationService } from "@geocutters/shared";
import { Button } from "@/components/ui/button";
import { StepOne } from "@/components/features/register/StepOne";
import { StepTwo } from "@/components/features/register/StepTwo";
import StepThree from "@/components/features/register/StepThree";
import StepFour from "@/components/features/register/StepFour";

const STEPS = ["Your info", "Service area", "Services", "Details"];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1: Personal info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Service area
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [radius, setRadius] = useState(5000);

  // Step 3: Services
  const [services, setServices] = useState<RegistrationService[]>([
    { name: "", price: "", duration: "" },
  ]);

  // Step 4: Details
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState<number | null>(null);
  const [dbs, setDbs] = useState(false);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    // Collect all form data
    const formData = {
      name,
      email,
      password,
      phone: null,
      lat,
      lng,
      radius,
      services,
      bio,
      experience,
      dbs,
    };

    console.log("Submitting:", formData);

    // Send to your API
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  const addService = () =>
    setServices((prev) => [...prev, { name: "", price: "", duration: "" }]);

  const removeService = (i: number) =>
    setServices((prev) => prev.filter((_, idx) => idx !== i));

  const updateService = (
    i: number,
    field: keyof RegistrationService,
    val: string,
  ) => {
    setServices((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)),
    );
  };

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
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
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
            <StepTwo
              lat={lat}
              setLat={setLat}
              lng={lng}
              setLng={setLng}
              radius={radius}
              setRadius={setRadius}
              onNext={handleNext}
              onBack={handleBack}
            />
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
            <StepThree
              services={services}
              onAddService={addService}
              onRemoveService={removeService}
              onUpdateService={updateService}
              onNext={handleNext}
              onBack={handleBack}
            />
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
            <StepFour
              bio={bio}
              setBio={setBio}
              experience={experience}
              setExperience={setExperience}
              dbs={dbs}
              setDbs={setDbs}
              onSubmit={handleSubmit}
              onBack={handleBack}
            />
          </div>
        )}
      </div>
    </div>
  );
}
