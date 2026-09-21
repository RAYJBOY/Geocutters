import Link from "next/link";

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
    <NavigationMenu className="max-w-full p-4 bg-foreground">
      <NavigationMenuList className="w-full flex gap-3 h-full">
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
  );
};
