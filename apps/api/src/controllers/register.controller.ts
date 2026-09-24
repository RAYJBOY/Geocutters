import type { Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client.js";
import {
  registerHairdresser,
  RegistrationValidationError,
  type RegisterPayload,
} from "../services/register.service";

export async function registerController(req: Request, res: Response) {
  try {
    const hairdresser = await registerHairdresser(req.body as RegisterPayload);
    res.status(201).json({ hairdresser });
  } catch (error) {
    if (error instanceof RegistrationValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({ error: "A hairdresser with this email already exists" });
      return;
    }

    console.error("Failed to register hairdresser:", error);
    res.status(500).json({ error: "Unable to register hairdresser" });
  }
}