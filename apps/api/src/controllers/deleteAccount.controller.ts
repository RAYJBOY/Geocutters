import type { Request, Response } from "express";
import { deleteSupabaseAccount } from "../services/deleteAccount.service.js";
import { getSupabaseUser } from "../services/supabase-auth.service.js";

export async function deleteAccountController(req: Request, res: Response) {
  try {
    const accessToken = req.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!accessToken) {
      res.status(401).json({ error: "Sign in to delete your account" });
      return;
    }

    const user = await getSupabaseUser(accessToken);
    if (!user) {
      res.status(401).json({ error: "Your session is invalid or expired" });
      return;
    }

    await deleteSupabaseAccount(user.id);
    res.status(204).end();
  } catch (error) {
    console.error("Failed to delete account:", error);
    res.status(500).json({ error: "Unable to delete account" });
  }
}
