import { Router } from "express";
import { hairdresserRegisterController } from "../controllers/registerAsHairdresser.controller.js";

const authRoute = Router();

authRoute.post("/registerAsHairdresser", hairdresserRegisterController);

export { authRoute };