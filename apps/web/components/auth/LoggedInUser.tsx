"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, UserRound } from "lucide-react";

type LoggedInUserProps = {
  name: string;
};

export const LoggedInUser = ({ name }: LoggedInUserProps) => {
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await getSupabaseBrowserClient().auth.signOut();
    if (!error) router.refresh();
  };

  const goToProfile = () => {
    router.push("/profile");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="max-w-56 text-background hover:bg-background/10 hover:text-background"
          />
        }
      >
        <UserRound aria-hidden="true" />
        <span className="max-w-40 truncate">{name}</span>
        <ChevronDown aria-hidden="true" className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={goToProfile}>
          <UserRound aria-hidden="true" />
          My profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut aria-hidden="true" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
