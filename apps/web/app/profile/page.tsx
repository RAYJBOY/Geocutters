"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type {
  HairdresserProfileForm,
  HairdresserProfileResponse,
  HairdresserProfileUpdateRequest,
} from "@geocutters/shared";
import { isServiceName, SERVICE_NAMES } from "@geocutters/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useHairdresserAccount } from "@/hooks/useHairdresserAccount";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

function toEditableProfile(
  profile: NonNullable<HairdresserProfileResponse["hairdresser"]>,
): HairdresserProfileForm {
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone ?? "",
    bio: profile.bio ?? "",
    yearsOfExperience: profile.yearsOfExperience?.toString() ?? "",
    serviceCenterLat: profile.serviceCenterLat.toString(),
    serviceCenterLng: profile.serviceCenterLng.toString(),
    serviceRadiusM: profile.serviceRadiusM.toString(),
    services: profile.services.map((service) => ({
      id: service.id,
      name: service.name,
      price: service.price.toString(),
      durationMinutes: service.durationMinutes.toString(),
    })),
  };
}

export default function ProfilePage() {
  const { status, accessToken, user } = useHairdresserAccount();

  if (status === "checking") {
    return <ProfileMessage>Loading your profile...</ProfileMessage>;
  }
  if (status === "error") {
    return <ProfileMessage>We couldn&apos;t verify your account. Please sign in again.</ProfileMessage>;
  }
  if (!user || !accessToken) {
    return <ProfileMessage>Sign in to view and edit your profile.</ProfileMessage>;
  }

  return (
    <ProfileEditor key={user.id} user={user} accessToken={accessToken} />
  );
}

function ProfileMessage({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
        {children}
      </p>
    </main>
  );
}

function ProfileEditor({ user, accessToken }: { user: User; accessToken: string }) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [name, setName] = useState(
    typeof user.user_metadata.name === "string" ? user.user_metadata.name : "",
  );
  const [email, setEmail] = useState(user.email ?? "");
  const [profile, setProfile] = useState<HairdresserProfileForm | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/hairdresser/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status === 404) return null;
        const body: HairdresserProfileResponse = await response.json();
        if (!response.ok || !body.hairdresser) {
          throw new Error(body.error ?? "Unable to load your hairdresser profile");
        }
        return body.hairdresser;
      })
      .then((hairdresser) => {
        if (hairdresser) setProfile(toEditableProfile(hairdresser));
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return;
        console.error("Failed to load hairdresser profile:", requestError);
        setProfileError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load your hairdresser profile",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setProfileLoading(false);
      });
    return () => controller.abort();
  }, [accessToken]);

  const saveAccountDetails = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email, name }),
      });
      const body: { user?: { id: string; email: string }; error?: string } =
        await response.json();
      if (!response.ok || !body.user) {
        throw new Error(body.error ?? "Unable to update your account details");
      }

      setEmail(body.user.email);
      setMessage(
        email !== user.email
          ? "Your details were saved. Check your email to confirm the email address change."
          : "Your details were saved.",
      );
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save your details");
    } finally {
      setSaving(false);
    }
  };

  const saveHairdresserProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/hairdresser/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profileToRequest(profile)),
      });
      const body: HairdresserProfileResponse = await response.json();
      if (!response.ok || !body.hairdresser) {
        throw new Error(body.error ?? "Unable to update your hairdresser profile");
      }
      setProfile(toEditableProfile(body.hairdresser));
      setMessage("Hairdresser profile saved.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save your profile");
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Delete your account permanently? This cannot be undone.")) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/auth/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) {
        const body: { error?: string } = await response.json();
        throw new Error(body.error ?? "Unable to delete your account");
      }
      await supabase.auth.signOut();
      router.replace("/");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete your account");
      setSaving(false);
    }
  };

  const updatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const password = String(values.get("password") ?? "");
    const confirmation = String(values.get("confirmPassword") ?? "");
    if (password !== confirmation) {
      setError("The passwords do not match.");
      setMessage("");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) throw authError;
      form.reset();
      setMessage("Password updated.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update your password",
      );
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (changes: Partial<HairdresserProfileForm>) => {
    setProfile((current) => (current ? { ...current, ...changes } : current));
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/30 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">My profile</h1>
          <p className="mt-2 text-muted-foreground">View and manage your account details.</p>
        </header>

        {(error || profileError || message) && (
          <p
            role={error || profileError ? "alert" : "status"}
            className={`rounded-lg border px-4 py-3 text-sm ${
              error || profileError
                ? "border-destructive/30 bg-destructive/5 text-destructive"
                : "bg-card text-foreground"
            }`}
          >
            {error || profileError || message}
          </p>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Account details</CardTitle>
            <CardDescription>Change your name or email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={saveAccountDetails}>
              <div className="space-y-2">
                <Label htmlFor="profile-name">Name</Label>
                <Input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <Button type="submit" disabled={saving || profileLoading}>
                Save details
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Passwords are not visible; you can set a new one here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={updatePassword}>
              <div className="space-y-2">
                <Label htmlFor="profile-password">New password</Label>
                <Input id="profile-password" name="password" type="password" autoComplete="new-password" minLength={6} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-confirm-password">Confirm new password</Label>
                <Input id="profile-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={6} required />
              </div>
              <Button type="submit" disabled={saving}>Update password</Button>
            </form>
          </CardContent>
        </Card>

        {profileLoading && <p className="text-sm text-muted-foreground">Checking for a hairdresser profile...</p>}
        {profile && (
          <Card>
            <CardHeader>
              <CardTitle>Hairdresser profile</CardTitle>
              <CardDescription>Edit your services and service area.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={saveHairdresserProfile}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="profile-phone">Phone</Label>
                    <Input id="profile-phone" value={profile.phone} onChange={(event) => updateProfile({ phone: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-experience">Years of experience</Label>
                    <Input id="profile-experience" type="number" min="0" step="1" value={profile.yearsOfExperience} onChange={(event) => updateProfile({ yearsOfExperience: event.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-bio">About you</Label>
                  <Textarea id="profile-bio" value={profile.bio} onChange={(event) => updateProfile({ bio: event.target.value })} />
                </div>

                <section className="space-y-3">
                  <div>
                    <h3 className="font-medium">Service area</h3>
                    <p className="text-sm text-muted-foreground">Set your service center coordinates and travel radius in metres.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="service-lat">Latitude</Label>
                      <Input id="service-lat" type="number" step="any" min="-90" max="90" value={profile.serviceCenterLat} onChange={(event) => updateProfile({ serviceCenterLat: event.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-lng">Longitude</Label>
                      <Input id="service-lng" type="number" step="any" min="-180" max="180" value={profile.serviceCenterLng} onChange={(event) => updateProfile({ serviceCenterLng: event.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-radius">Radius (metres)</Label>
                      <Input id="service-radius" type="number" min="1" step="1" value={profile.serviceRadiusM} onChange={(event) => updateProfile({ serviceRadiusM: event.target.value })} required />
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-medium">Services</h3>
                      <p className="text-sm text-muted-foreground">Add, edit, or remove the services you offer.</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        updateProfile({
                          services: [
                            ...profile.services,
                            { name: "", price: "", durationMinutes: "" },
                          ],
                        })
                      }
                    >
                      Add service
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {profile.services.map((service, index) => (
                      <div key={service.id ?? index} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_8rem_8rem_auto]">
                        <div className="space-y-2">
                          <Label htmlFor={`service-name-${index}`}>Name</Label>
                          <Select
                            value={isServiceName(service.name) ? service.name : ""}
                            onValueChange={(value) => {
                              if (value === null) return;
                              const services = [...profile.services];
                              services[index] = { ...service, name: value };
                              updateProfile({ services });
                            }}
                          >
                            <SelectTrigger
                              id={`service-name-${index}`}
                              className="w-full"
                            >
                              <SelectValue placeholder="Choose a service" />
                            </SelectTrigger>
                            <SelectContent
                              side="bottom"
                              alignItemWithTrigger={false}
                            >
                            {SERVICE_NAMES.map((serviceName) => (
                                <SelectItem key={serviceName} value={serviceName}>
                                  {serviceName}
                                </SelectItem>
                            ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`service-price-${index}`}>Price (£)</Label>
                          <Input id={`service-price-${index}`} type="number" min="0" step="0.01" value={service.price} onChange={(event) => {
                            const services = [...profile.services];
                            services[index] = { ...service, price: event.target.value };
                            updateProfile({ services });
                          }} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`service-duration-${index}`}>Minutes</Label>
                          <Input id={`service-duration-${index}`} type="number" min="1" step="1" value={service.durationMinutes} onChange={(event) => {
                            const services = [...profile.services];
                            services[index] = { ...service, durationMinutes: event.target.value };
                            updateProfile({ services });
                          }} required />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="self-end"
                          disabled={profile.services.length === 1}
                          onClick={() =>
                            updateProfile({
                              services: profile.services.filter((_, itemIndex) => itemIndex !== index),
                            })
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save hairdresser profile"}</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="ring-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Delete account</CardTitle>
            <CardDescription>
              Permanently delete your account and any hairdresser profile and services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" disabled={saving} onClick={() => void deleteAccount()}>
              Delete my account
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function profileToRequest(
  profile: HairdresserProfileForm,
): HairdresserProfileUpdateRequest {
  return {
    name: profile.name,
    phone: profile.phone || null,
    bio: profile.bio || null,
    yearsOfExperience: profile.yearsOfExperience === "" ? null : Number(profile.yearsOfExperience),
    serviceCenterLat: Number(profile.serviceCenterLat),
    serviceCenterLng: Number(profile.serviceCenterLng),
    serviceRadiusM: Number(profile.serviceRadiusM),
    services: profile.services.map((service) => {
      if (!isServiceName(service.name)) {
        throw new Error("Choose a valid service for each service entry.");
      }
      return {
        name: service.name,
        price: Number(service.price),
        durationMinutes: Number(service.durationMinutes),
      };
    }),
  };
}
