import type { Request, Response } from "express";
import type { PublicHairdresserProfileResponse } from "@geocutters/shared";
import { getPublicHairdresserProfile } from "../services/findHairdressers.service.js";

export async function getPublicHairdresserController(
  req: Request,
  res: Response,
) {
  try {
    const { id } = req.params;
    if (typeof id !== "string" || id.trim() === "") {
      res.status(400).json({ error: "A hairdresser ID is required" });
      return;
    }

    const hairdresser = await getPublicHairdresserProfile(id);
    if (!hairdresser) {
      res.status(404).json({ error: "Hairdresser profile not found" });
      return;
    }

    const body: PublicHairdresserProfileResponse = { hairdresser };
    res.json(body);
  } catch (error) {
    console.error("Failed to get public hairdresser profile:", error);
    res.status(500).json({ error: "Unable to get hairdresser profile" });
  }
}
