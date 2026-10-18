import type { Request, Response } from "express";
import type { HairdresserSearchResponse } from "@geocutters/shared";
import { findHairdressers } from "../services/findHairdressers.service.js";

export async function findHairdressersController(req: Request, res: Response) {
  try {
    const latParam = req.query.lat;
    const lngParam = req.query.lng;
    const dbsParam = req.query.hasDbsCheck;

    if (latParam === undefined || lngParam === undefined) {
      res.status(400).json({ error: "Provide both lat and lng coordinates" });
      return;
    }
    if (
      typeof latParam !== "string" ||
      typeof lngParam !== "string" ||
      latParam.trim() === "" ||
      lngParam.trim() === ""
    ) {
      res.status(400).json({ error: "Coordinates must be valid numbers" });
      return;
    }

    const lat = Number(latParam);
    const lng = Number(lngParam);
    if (
      !Number.isFinite(lat) ||
      lat < -90 ||
      lat > 90 ||
      !Number.isFinite(lng) ||
      lng < -180 ||
      lng > 180
    ) {
      res.status(400).json({ error: "Coordinates must be valid numbers" });
      return;
    }
    const location = { lat, lng };

    if (dbsParam !== undefined && dbsParam !== "true" && dbsParam !== "false") {
      res.status(400).json({ error: "hasDbsCheck must be true or false" });
      return;
    }

    const hairdressers = await findHairdressers({
      location,
      hasDbsCheck: dbsParam === "true",
    });
    const body: HairdresserSearchResponse = { hairdressers };
    res.json(body);
  } catch (error) {
    console.error("Failed to find hairdressers:", error);
    res.status(500).json({ error: "Unable to find hairdressers" });
  }
}
