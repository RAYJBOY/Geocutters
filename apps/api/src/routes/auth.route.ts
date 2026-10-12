import { Router } from "express";
import { hairdresserRegisterController } from "../controllers/registerAsHairdresser.controller.js";
import { deleteAccountController } from "../controllers/deleteAccount.controller.js";

const authRoute = Router();

authRoute.post("/registerAsHairdresser", hairdresserRegisterController);
authRoute.delete("/me", deleteAccountController);

export { authRoute };