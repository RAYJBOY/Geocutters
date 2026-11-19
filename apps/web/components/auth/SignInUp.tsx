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
};

export const SignInUp = ({ redirectTo }: SignInUpProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button className="h-9 rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90" />
        }
      >
        <User />
        Sign In/Up
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
