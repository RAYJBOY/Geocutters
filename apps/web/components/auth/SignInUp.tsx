import { User, Link } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

export const SignInUp = () => {
  return (
    <Dialog>
      <DialogTrigger render={<span />}>
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
          <User />
          Sign In/Up
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Tabs defaultValue="account" >
          <TabsList>
            <TabsTrigger value="signIn">Sign In</TabsTrigger>
            <TabsTrigger value="signUp">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signIn">
            <SignInForm />
          </TabsContent>
          <TabsContent value="signUp">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
