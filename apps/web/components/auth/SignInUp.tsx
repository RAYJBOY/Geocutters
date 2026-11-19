"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

type SignInUpProps = {
  redirectTo?: string;
  showLabelOnMobile?: boolean;
};

export const SignInUp = ({
  redirectTo,
  showLabelOnMobile = false,
}: SignInUpProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button
            aria-label="Sign in or sign up"
            className={`h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 ${
              showLabelOnMobile ? "w-auto px-4" : "w-9 p-0 sm:w-auto sm:px-4"
            }`}
          />
        }
      >
        <User aria-hidden="true" />
        <span className={showLabelOnMobile ? "" : "hidden sm:inline"}>
          Sign In/Up
        </span>
      </DialogTrigger>
      <DialogContent>
        <Tabs defaultValue="signUp">
          <TabsList>
            <TabsTrigger value="signUp">Sign Up</TabsTrigger>
            <TabsTrigger value="signIn">Sign In</TabsTrigger>
          </TabsList>
          <TabsContent value="signUp">
            <SignUpForm redirectTo={redirectTo} />
          </TabsContent>
          <TabsContent value="signIn">
            <SignInForm
              onSignedIn={() => {
                setIsOpen(false);
                router.refresh();
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
