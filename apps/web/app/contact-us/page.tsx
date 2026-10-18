import { Mail, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ContactUsPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/30 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center sm:mb-10">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Get in touch
          </h1>
          <p className="mt-3 text-muted-foreground">
            Have a question, some feedback, or need a hand? I’d love to hear
            from you.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pen
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              A note from the developer
            </CardTitle>
            <CardDescription>
              I’m building GeoCutters on my own and want to make it the best
              experience I can. Your feedback really helps!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            {contactEmail ? (
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="flex items-center gap-2">
                  <Mail
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                  Email me at:
                </CardTitle>
                <Button
                  nativeButton={false}
                  render={<a href={`mailto:${contactEmail}`} />}
                  variant="outline"
                  className="h-8"
                >
                  {contactEmail}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <Mail
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                  Email me at
                </CardTitle>
                <p role="alert" className="text-sm text-destructive">
                  The contact email address has not been configured yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
