import express from "express";
import {
    naverCallbackController,
    naverController,
    refreshAccessToken,
} from "./auth.controller.js";

const authRoutes = express.Router();

authRoutes.get("/naver", naverController);
authRoutes.post("/naver/callback", naverCallbackController);
authRoutes.post("/token/refresh", refreshAccessToken);
export default authRoutes;
