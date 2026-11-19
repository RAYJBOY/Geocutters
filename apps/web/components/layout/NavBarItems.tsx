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
    <NavigationMenuList className="flex gap-6">
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
              className="rounded-full px-4 py-2.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-transparent aria-[current=page]:font-semibold aria-[current=page]:text-foreground aria-[current=page]:hover:bg-muted aria-[current=page]:focus:bg-transparent aria-[current=page]:data-active:bg-transparent"
            />
          </NavigationMenuItem>
        );
      })}
    </NavigationMenuList>
  );
}
