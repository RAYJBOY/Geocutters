import { Router } from "express";
import { hairdresserRegisterController } from "../controllers/registerAsHairdresser.controller";
import {
	requestVerificationController,
	verifyController,
} from "../controllers/verification.controller.js";

const registerRoute = Router();

registerRoute.post("/registerAsHairdresser", hairdresserRegisterController);
registerRoute.post("/registerAsHairdresser/verification", requestVerificationController);
registerRoute.get("/registerAsHairdresser/verify", verifyController);

export { registerRoute };