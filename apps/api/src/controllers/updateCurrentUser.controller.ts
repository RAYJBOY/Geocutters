import type { Request, Response } from "express";
import { updateHairdresserNameByUserId } from "../services/getHairdresserByUserId.service.js";
import {
  getSupabaseUser,
  updateSupabaseUser,
} from "../services/supabase-auth.service.js";

export async function updateCurrentUserController(req: Request, res: Response) {
  try {
    const accessToken = req.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!accessToken) {
      res.status(401).json({ error: "Sign in to update your account" });
      return;
    }

    const user = await getSupabaseUser(accessToken);
    if (!user) {
      res.status(401).json({ error: "Your session is invalid or expired" });
      return;
    }

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      res.status(400).json({ error: "Account details are required" });
      return;
    }

    const { email, name } = req.body as Record<string, unknown>;
    if (typeof email !== "string" || !email.trim()) {
      res.status(400).json({ error: "A valid email address is required" });
      return;
    }
    if (typeof name !== "string" || !name.trim()) {
      res.status(400).json({ error: "A name is required" });
      return;
    }

    const updatedUser = await updateSupabaseUser(accessToken, {
      email: email.trim(),
      name: name.trim(),
    });
    if (!updatedUser) {
      res.status(401).json({ error: "Your session is invalid or expired" });
      return;
    }

    await updateHairdresserNameByUserId(user.id, name.trim(), email.trim());
    res.json({ user: updatedUser });
  } catch (error) {
    console.error("Failed to update signed-in user:", error);
    res.status(500).json({ error: "Unable to update account details" });
  }
}
