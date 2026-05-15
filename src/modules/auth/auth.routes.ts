import express from "express";
import { naverCallbackController, naverController } from "./auth.controller.js";

const authRoutes = express.Router();

authRoutes.get("/naver", naverController);
authRoutes.get("/naver/callback", naverCallbackController);

export default authRoutes;
