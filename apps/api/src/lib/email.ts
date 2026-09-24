import { Resend } from "resend";

type VerificationEmail = {
  to: string;
  verificationUrl: string;
};

export async function sendVerificationEmail({
  to,
  verificationUrl,
}: VerificationEmail) {
  const { RESEND_API_KEY, MAIL_FROM } = process.env;

  if (!RESEND_API_KEY || !MAIL_FROM) {
    console.log(`Verification URL for ${to}: ${verificationUrl}`);
    return;
  }

  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: MAIL_FROM,
    to,
    subject: "Verify your Geocutters email",
    text: `Verify your email by opening this link: ${verificationUrl}`,
    html: `<p>Verify your Geocutters email to continue registration.</p><p><a href="${verificationUrl}">Verify email</a></p>`,
  });

  if (error) {
    throw new Error(`Resend failed to send email: ${error.message}`);
  }
}