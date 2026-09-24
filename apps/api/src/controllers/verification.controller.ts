import type { Request, Response } from "express";
import {
  requestEmailVerification,
  verifyEmailToken,
} from "../services/verification.service.js";
import { RegistrationValidationError } from "../services/registration.errors";

export async function requestVerificationController(req: Request, res: Response) {
  try {
    await requestEmailVerification(req.body);
    res.status(202).json({ message: "Verification email sent" });
  } catch (error) {
    if (error instanceof RegistrationValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }

    console.error("Failed to send verification email:", error);
    res.status(500).json({ error: "Unable to send verification email" });
  }
}

export async function verifyController(req: Request, res: Response) {
  try {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    await verifyEmailToken(token);
    res.json({ verified: true });
  } catch (error) {
    if (error instanceof RegistrationValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }

    console.error("Failed to verify email:", error);
    res.status(500).json({ error: "Unable to verify email" });
  }
}