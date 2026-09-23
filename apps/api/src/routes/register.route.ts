import { Router } from "express";
import { registerController } from "../controllers/register.controller.js";

const registerRoute = Router();

registerRoute.post("/register", registerController);

export { registerRoute };