import Link from "next/link";

import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavBarLink } from "@/types/navbar";
import { SignInUp } from "../auth/SignInUp";
import { LoggedInUser } from "../auth/LoggedInUser";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { Button } from "@/components/ui/button";

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
    <div className="relative bg-foreground p-4">
      <div className="max-w-6xl mx-auto flex justify-center">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-3">
            {links.map((link: NavBarLink) => (
              <NavigationMenuItem key={link.name}>
                <NavigationMenuLink
                  render={<Link href={link.link}>{link.name}</Link>}
                  className="text-primary-foreground hover:bg-secondary/80 hover:text-accent-foreground"
                />
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex absolute top-4 right-4 gap-3">
        {!isHairdresser && (
          <Button
            variant="link"
            className="h-auto p-0 text-background underline-offset-4 hover:text-background/80 hover:no-underline"
          >
            <Link href="/joinAsHairdresser">Register as a hairdresser</Link>
          </Button>
        )}
        {!loggedInUser && <SignInUp />}
        {loggedInUser && <LoggedInUser name={displayName} />}
      </div>
    </div>
  );
};
