import type { Request, Response } from "express";
import type { HairdresserProfileResponse } from "@geocutters/shared";
import { Prisma } from "../../generated/prisma/client.js";
import { RegistrationValidationError } from "../services/registration.errors.js";
import {
  updateHairdresserByUserId,
} from "../services/getHairdresserByUserId.service.js";
import { getSupabaseUser } from "../services/supabase-auth.service.js";

export async function updateHairdresserProfileController(
  req: Request,
  res: Response,
) {
  try {
    const accessToken = req.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!accessToken) {
      res.status(401).json({ error: "Sign in to update your profile" });
      return;
    }

    const user = await getSupabaseUser(accessToken);
    if (!user) {
      res.status(401).json({ error: "Your session is invalid or expired" });
      return;
    }

    const hairdresser = await updateHairdresserByUserId(
      user.id,
      user.email,
      req.body,
    );
    const body: HairdresserProfileResponse = { hairdresser };
    res.json(body);
  } catch (error) {
    if (error instanceof RegistrationValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ error: "Hairdresser profile not found" });
      return;
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({ error: "That email is already in use" });
      return;
    }

    console.error("Failed to update hairdresser profile:", error);
    res.status(500).json({ error: "Unable to update hairdresser profile" });
  }
}
