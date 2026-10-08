import type { Request, Response } from "express";
import { findHairdressers } from "../services/findHairdressers.service.js";

export async function findHairdressersController(req: Request, res: Response) {
  try {
    const latParam = req.query.lat;
    const lngParam = req.query.lng;
    const distanceParam = req.query.distanceKm;
    const dbsParam = req.query.hasDbsCheck;

    if ((latParam === undefined) !== (lngParam === undefined)) {
      res.status(400).json({ error: "Provide both lat and lng coordinates" });
      return;
    }

    let location: { lat: number; lng: number } | undefined;
    let distanceKm: number | undefined;
    if (latParam !== undefined && lngParam !== undefined) {
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

      location = { lat, lng };

      if (typeof distanceParam !== "string" || distanceParam.trim() === "") {
        res.status(400).json({
          error: "distanceKm is required when filtering by location",
        });
        return;
      }

      distanceKm = Number(distanceParam);
      if (!Number.isFinite(distanceKm) || distanceKm < 1 || distanceKm > 50) {
        res.status(400).json({ error: "distanceKm must be between 1 and 50" });
        return;
      }
    } else if (distanceParam !== undefined) {
      res.status(400).json({
        error: "Provide location coordinates to filter by distance",
      });
      return;
    }

    if (dbsParam !== undefined && dbsParam !== "true" && dbsParam !== "false") {
      res.status(400).json({ error: "hasDbsCheck must be true or false" });
      return;
    }

    const hairdressers = await findHairdressers({
      ...(location === undefined ? {} : { location }),
      ...(distanceKm === undefined ? {} : { distanceKm }),
      hasDbsCheck: dbsParam === "true",
    });
    res.json({ hairdressers });
  } catch (error) {
    console.error("Failed to find hairdressers:", error);
    res.status(500).json({ error: "Unable to find hairdressers" });
  }
}
