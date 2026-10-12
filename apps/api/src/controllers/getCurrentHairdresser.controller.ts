import type { Request, Response } from "express";
import { getHairdresserByUserId } from "../services/getHairdresserByUserId.service.js";
import { getSupabaseUser } from "../services/supabase-auth.service.js";

export async function getCurrentHairdresserController(
  req: Request,
  res: Response,
) {
  try {
    const accessToken = req.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!accessToken) {
      res.status(401).json({ error: "Sign in to view your hairdresser profile" });
      return;
    }

    const user = await getSupabaseUser(accessToken);
    if (!user) {
      res.status(401).json({ error: "Your session is invalid or expired" });
      return;
    }

    const hairdresser = await getHairdresserByUserId(user.id);
    if (!hairdresser) {
      res.status(404).json({ error: "Hairdresser profile not found" });
      return;
    }

    res.json({ hairdresser });
  } catch (error) {
    console.error("Failed to get current hairdresser profile:", error);
    res.status(500).json({ error: "Unable to get hairdresser profile" });
  }
}
