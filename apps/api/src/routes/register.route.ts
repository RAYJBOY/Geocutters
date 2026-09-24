import { Router } from "express";
import { registerController } from "../controllers/register.controller.js";
import {
	requestVerificationController,
	verifyController,
} from "../controllers/verification.controller.js";

const registerRoute = Router();

registerRoute.post("/register", registerController);
registerRoute.post("/register/verification", requestVerificationController);
registerRoute.get("/register/verify", verifyController);

export { registerRoute };