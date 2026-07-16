import { config } from "@/config/env.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn(
      "⚠️ 인증 실패: Authorization 헤더가 없거나 Bearer 형식이 아님",
    );
    return res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
  }

  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ message: "토큰이 필요합니다." });
  }

  try {
    const payload = jwt.verify(accessToken, config.jwtSecretKey);
    if (payload && typeof payload === "object" && "id" in payload) {
      res.locals.userId = payload.id;
    }

    next();
  } catch (error) {
    console.error("❌ JWT 검증 에러:", error);
    return res
      .status(401)
      .json({ message: "유효하지 않거나 만료된 토큰입니다." });
  }
};
