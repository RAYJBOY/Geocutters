"use client";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

export const SignInForm = () => {
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");
      const supabase = getSupabaseBrowserClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Error signing up.");
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  return (
    <form
      className="w-full max-w-md space-y-4 rounded-xl p-2"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Sign in</h2>
        <p className="text-sm text-muted-foreground">Sign in to continue</p>
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

      {error && <div>{error}</div>}

      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  );
};
