import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavBarLink } from "@/types/navbar";

interface NavBarProps {
  links: NavBarLink[];
}

export const NavBar = ({ links }: NavBarProps) => {
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

      <Button className="absolute top-4 right-4 bg-background text-foreground p-4 hover:bg-foreground hover:text-background">
        <Link href="/register">Register as a hairdresser</Link>
      </Button>
    </div>
  );
};
