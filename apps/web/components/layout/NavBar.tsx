import Link from "next/link";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { NavBarLink } from "@/types/navbar";
import { SignInUp } from "../auth/SignInUp";
import { LoggedInUser } from "../auth/LoggedInUser";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { Button } from "@/components/ui/button";
import { NavBarItems } from "./NavBarItems";

interface NavBarProps {
  links: NavBarLink[];
}

export const NavBar = async ({ links }: NavBarProps) => {
  const supabase = await createSupabaseServerClient();

  const loggedInUser = (await supabase.auth.getUser()).data.user;
  const accessToken = (await supabase.auth.getSession()).data.session
    ?.access_token;
  let isHairdresser = false;

  if (loggedInUser && accessToken) {
    try {
      const apiUrl = process.env.API_URL!;
      const response = await fetch(`${apiUrl}/api/hairdresser/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });

      if (response.ok) {
        isHairdresser = true;
      } else if (response.status !== 404) {
        const body: { error?: string } = await response.json();
        throw new Error(body.error ?? "Unable to verify hairdresser profile");
      } else {
        isHairdresser = false;
      }
    } catch (error) {
      console.error("Failed to check hairdresser profile:", error);
    }
  }

  const name = loggedInUser?.user_metadata?.name;
  const displayName =
    typeof name === "string" && name.trim()
      ? name.trim()
      : (loggedInUser?.email ?? "Account");
  return (
    <header className="relative border-b border-border bg-background px-4 py-3">
      <div className="mx-auto grid min-h-11 max-w-screen-2xl grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold tracking-[0.22em] text-foreground"
        >
          GEOCUTTERS
        </Link>

        <div className="hidden justify-center md:flex">
          <NavigationMenu>
            <NavBarItems links={links} />
          </NavigationMenu>
        </div>

        <div className="flex items-center justify-self-end gap-2">
          {!isHairdresser && (
            <Button
              nativeButton={false}
              render={<Link href="/joinAsHairdresser" />}
              className="hidden h-9 rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90 sm:inline-flex"
            >
              Join as a hairdresser
            </Button>
          )}
          {!loggedInUser && <SignInUp />}
          {loggedInUser && <LoggedInUser name={displayName} />}
        </div>
      </div>
    </header>
  );
};
