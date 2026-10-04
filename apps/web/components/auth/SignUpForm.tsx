"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export const SignUpForm = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");
      const name = String(formData.get("name") ?? "").trim();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
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

      <Button type="submit" className="w-full">
        Sign up
      </Button>
    </form>
  );
};
