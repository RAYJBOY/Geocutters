import { Router } from "express";
import { findHairdressersController } from "../controllers/findHairdressers.controller.js";

const hairdresserRoute = Router();

hairdresserRoute.get("/", findHairdressersController);

export { hairdresserRoute };