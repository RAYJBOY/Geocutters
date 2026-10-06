import { Router } from "express";
import { hairdresserRegisterController } from "../controllers/registerAsHairdresser.controller.js";

const registerRoute = Router();

registerRoute.post("/registerAsHairdresser", hairdresserRegisterController);

export { registerRoute };