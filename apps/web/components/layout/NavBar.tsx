import Link from "next/link";
import { Button } from "@/components/ui/button";

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

interface NavBarProps {
  links: NavBarLink[];
}

export const NavBar = async ({ links }: NavBarProps) => {
  const supabase = await createSupabaseServerClient();

  const loggedInUser = (await supabase.auth.getUser()).data.user;
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
        <Button
          variant="link"
          className="h-auto p-0 text-background underline-offset-4 hover:text-background/80 hover:no-underline"
        >
          <Link href="/joinAsHairdresser">Register as a hairdresser</Link>
        </Button>
        {!loggedInUser && <SignInUp />}
        {loggedInUser && <LoggedInUser name={displayName} />}
      </div>
    </div>
  );
};
