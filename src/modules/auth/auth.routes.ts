import express from "express";
import { authenticateUser } from "@/middleware/authenticateUser.js";
import {
    getMe,
    naverCallbackController,
    naverController,
    naverLogoutController,
    refreshAccessToken,
} from "./auth.controller.js";

const authRoutes = express.Router();

authRoutes.get("/naver", naverController);
authRoutes.post("/naver/callback", naverCallbackController);
authRoutes.post("/token/refresh", refreshAccessToken);
authRoutes.get("/me", authenticateUser, getMe);
authRoutes.post("/naver/logout", naverLogoutController);
export default authRoutes;
