import type { Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client.js";
import {
  registerHairdresser,
  type RegisterPayload,
} from "../services/registerAsHairdresser.service";
import { RegistrationValidationError } from "../services/registration.errors";
import { getSupabaseUser } from "../services/supabase-auth.service";

export async function hairdresserRegisterController(req: Request, res: Response) {
  try {
    const authorization = req.get("authorization");
    const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!accessToken) {
      res.status(401).json({ error: "Sign in to register as a hairdresser" });
      return;
    }

    const user = await getSupabaseUser(accessToken);
    if (!user) {
      res.status(401).json({ error: "Your session is invalid or expired" });
      return;
    }

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      res.status(400).json({ error: "A hairdresser profile is required" });
      return;
    }

    const hairdresser = await registerHairdresser(
      req.body as RegisterPayload,
      user,
    );
    res.status(201).json({
      message: "Hairdresser profile submitted",
      hairdresserId: hairdresser.id,
    });
  } catch (error) {
    if (error instanceof RegistrationValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        error: "A hairdresser profile already exists for this account or email",
      });
      return;
    }

    console.error("Failed to register hairdresser:", error);
    res.status(500).json({ error: "Unable to register hairdresser" });
  }
}