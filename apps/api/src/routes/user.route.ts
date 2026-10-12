import { Router } from "express";
import { updateCurrentUserController } from "../controllers/updateCurrentUser.controller.js";

const userRoute = Router();

userRoute.put("/me", updateCurrentUserController);

export { userRoute };
