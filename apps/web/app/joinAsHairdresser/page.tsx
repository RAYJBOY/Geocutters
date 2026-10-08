"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { RegistrationService } from "@geocutters/shared";
import { SignInUp } from "@/components/auth/SignInUp";
import { StepOne } from "@/components/features/register/StepOne";
import { StepTwo } from "@/components/features/register/StepTwo";
import StepThree from "@/components/features/register/StepThree";
import StepFour from "@/components/features/register/StepFour";
import { Button } from "@/components/ui/button";
import { useHairdresserAccount } from "@/hooks/useHairdresserAccount";

const STEPS = ["Account", "Service area", "Services", "Details"];

export default function RegisterPage() {
  const router = useRouter();
  const accountIdRef = useRef<string | null>(null);
  const { status: accountStatus, accessToken, user } = useHairdresserAccount();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const [name, setName] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [radius, setRadius] = useState(5000);
  const [services, setServices] = useState<RegistrationService[]>([
    { name: "", price: "", duration: "" },
  ]);
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState<number | null>(null);
  const [dbs, setDbs] = useState(false);

  useEffect(() => {
    if (accountIdRef.current === user?.id) return;

    accountIdRef.current = user?.id ?? null;
    setStep(1);
    setName(
      typeof user?.user_metadata?.name === "string"
        ? user.user_metadata.name.trim()
        : "",
    );
    setLat(null);
    setLng(null);
    setRadius(5000);
    setServices([{ name: "", price: "", duration: "" }]);
    setBio("");
    setExperience(null);
    setDbs(false);
    setSubmitError("");
  }, [user]);

  const handleNext = () => setStep((currentStep) => currentStep + 1);
  const handleBack = () => setStep((currentStep) => currentStep - 1);

  const handleSubmit = async () => {
    if (!accessToken || !user) {
      setSubmitError("Please sign in again before submitting your profile.");
      return;
    }

    setSubmitError("");
    setSubmitLoading(true);
    try {
      const response = await fetch("/api/auth/registerAsHairdresser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name,
          phone: null,
          lat,
          lng,
          radius,
          services,
          bio,
          experience,
          dbs,
        }),
      });

      const body = await response.json();
      if (!response.ok) {
        setSubmitError(body.error ?? "Unable to complete registration");
        return;
      }
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit hairdresser profile:", error);
      setSubmitError("Unable to complete registration");
    } finally {
      setSubmitLoading(false);
    }
  };

  const addService = () =>
    setServices((previous) => [
      ...previous,
      { name: "", price: "", duration: "" },
    ]);

  const removeService = (index: number) =>
    setServices((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index),
    );

  const updateService = (
    index: number,
    field: keyof RegistrationService,
    value: string,
  ) => {
    setServices((previous) =>
      previous.map((service, itemIndex) =>
        itemIndex === index ? { ...service, [field]: value } : service,
      ),
    );
  };

  if (accountStatus === "checking") {
    return (
      <div className="mx-auto flex min-h-64 max-w-lg items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          Checking your account...
        </p>
      </div>
    );
  }

  if (accountStatus === "error") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          We couldn&apos;t verify your account
        </h1>
        <p className="mt-3 text-muted-foreground">
          Please refresh the page or sign in again.
        </p>
      </div>
    );
  }

  if (accountStatus === "signedOut" || !user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Sign in to register as a hairdresser
        </h1>
        <p className="mt-3 text-muted-foreground">
          Use your existing Geocutters account, or create one, to set up your
          hairdresser profile.
        </p>
        <div className="mt-6 flex justify-center">
          <SignInUp redirectTo="/joinAsHairdresser" />
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-card rounded-xl p-8 max-w-md text-center border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Application submitted!
          </h2>
          <p className="text-muted-foreground mb-6">
            We&apos;ll review your profile and email you within 48 hours.
          </p>
          <Button className="w-full" onClick={() => router.push("/")}>
            Return home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-12">
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          {STEPS.map((_, index) => {
            const number = index + 1;
            const done = step > number;
            const active = step === number;

            return (
              <div key={number} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    done || active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? "✓" : number}
                </div>
                {number < STEPS.length && (
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

      <div className="bg-card border border-border rounded-xl p-6">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              Your account
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              This profile will be connected to your signed-in Geocutters
              account.
            </p>
            <StepOne
              name={name}
              setName={setName}
              email={user.email ?? ""}
              onNext={handleNext}
            />
          </div>
        )}

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
              onSubmit={() => {
                if (!submitLoading) void handleSubmit();
              }}
              onBack={handleBack}
            />
            {submitLoading && (
              <p className="mt-4 text-sm text-muted-foreground" role="status">
                Submitting your profile...
              </p>
            )}
            {submitError && (
              <p className="mt-4 text-sm text-destructive" role="alert">
                {submitError}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
