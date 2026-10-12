import { Router } from "express";
import { findHairdressersController } from "../controllers/findHairdressers.controller.js";
import { getCurrentHairdresserController } from "../controllers/getCurrentHairdresser.controller.js";
import { updateHairdresserProfileController } from "../controllers/updateHairdresserProfile.controller.js";

const hairdresserRoute = Router();

hairdresserRoute.get("/", findHairdressersController);
hairdresserRoute.get("/me", getCurrentHairdresserController);
hairdresserRoute.put("/me", updateHairdresserProfileController);

export { hairdresserRoute };