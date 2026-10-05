import { User } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

export const SignInUp = () => {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80" />
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
            <SignUpForm />
          </TabsContent>
          <TabsContent value="signIn">
            <SignInForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
