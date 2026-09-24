import { promisify } from "node:util";
import { createHash, randomBytes, scrypt as scryptCallback } from "node:crypto";
import type { RequestVerification } from "@geocutters/shared";
import { prisma } from "../../lib/prisma.js";
import { sendVerificationEmail } from "../lib/email.js";
import { RegistrationValidationError } from "./registration.errors";

const scrypt = promisify(scryptCallback);
const VERIFICATION_TTL_MS = 30 * 60 * 1000;

function requiredString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new RegistrationValidationError(`${field} is required`);
  }

  return value.trim();
}

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

export async function requestEmailVerification(
  input: RequestVerification,
) {
  const name = requiredString(input.name, "name");
  const email = requiredString(input.email, "email").toLowerCase();
  const password = requiredString(input.password, "password");

  if (!email.includes("@")) {
    throw new RegistrationValidationError("email is invalid");
  }

  const existingHairdresser = await prisma.hairdresser.findUnique({
    where: { email },
  });
  if (existingHairdresser) {
    throw new RegistrationValidationError("email is already registered");
  }

  await prisma.registrationVerification.deleteMany({ where: { email } });

  const token = randomBytes(32).toString("hex");
  await prisma.registrationVerification.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      tokenHash: tokenHash(token),
      expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS),
    },
  });

  const webUrl = process.env.WEB_URL ?? "http://localhost:3000";
  await sendVerificationEmail({
    to: email,
    verificationUrl: `${webUrl}/register?verificationToken=${token}`,
  });
}

export async function verifyEmailToken(token: string) {
  const verification = await prisma.registrationVerification.findUnique({
    where: { tokenHash: tokenHash(token) },
  });

  if (!verification || verification.expiresAt <= new Date()) {
    throw new RegistrationValidationError("verification link is invalid or expired");
  }

  if (!verification.verifiedAt) {
    await prisma.registrationVerification.update({
      where: { id: verification.id },
      data: { verifiedAt: new Date() },
    });
  }
}

export async function getVerifiedRegistration(token: string) {
  const verification = await prisma.registrationVerification.findUnique({
    where: { tokenHash: tokenHash(token) },
  });

  if (
    !verification ||
    !verification.verifiedAt ||
    verification.expiresAt <= new Date()
  ) {
    throw new RegistrationValidationError("email verification is required");
  }

  return verification;
}