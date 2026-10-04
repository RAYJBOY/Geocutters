import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Prisma } from "../../generated/prisma/client.js";
import {
  registerHairdresser,
  type RegisterPayload,
} from "../services/registerAsHairdresser.service";
import { RegistrationValidationError } from "../services/registration.errors";

export async function hairdresserRegisterController(req: Request, res: Response) {
  try {
    const hairdresser = await registerHairdresser(req.body as RegisterPayload);
    const token = jwt.sign(
      { sub: hairdresser.id, email: hairdresser.email },
      process.env.JWT_SECRET ?? "development-only-secret",
      { expiresIn: "7d" },
    );
    res.status(201).json({ hairdresser, token });
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