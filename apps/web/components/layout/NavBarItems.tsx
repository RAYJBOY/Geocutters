"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import type { NavBarLink } from "@/types/navbar";

export function NavBarItems({ links }: { links: NavBarLink[] }) {
  const pathname = usePathname();

  return (
    <NavigationMenuList className="flex gap-3">
      {links.map((link) => {
        const isCurrentPage =
          pathname === link.link ||
          (link.link !== "/" && pathname.startsWith(`${link.link}/`));

        return (
          <NavigationMenuItem key={link.name}>
            <NavigationMenuLink
              render={
                <Link
                  href={link.link}
                  aria-current={isCurrentPage ? "page" : undefined}
                >
                  {link.name}
                </Link>
              }
              className="text-primary-foreground hover:bg-secondary/80 hover:text-accent-foreground focus:bg-transparent aria-[current=page]:hover:bg-transparent aria-[current=page]:hover:text-primary-foreground aria-[current=page]:focus:bg-transparent aria-[current=page]:data-active:bg-transparent aria-[current=page]:data-active:hover:bg-transparent aria-[current=page]:data-active:focus:bg-transparent"
            />
          </NavigationMenuItem>
        );
      })}
    </NavigationMenuList>
  );
}
