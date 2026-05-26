import { config } from "@/config/env.js";
import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { getNaverAuthUrl, handleNaverLogin } from "./auth.service.js";

export const naverController = (req: Request, res: Response) => {
  const { state, url } = getNaverAuthUrl();

  res.cookie("naver_state", state, {
    httpOnly: true,
    maxAge: 10 * 60 * 1000,
  });
  res.redirect(url);
};

export const naverCallbackController = async (req: Request, res: Response) => {
  const { code, state } = req.body;
  // const savedState = req.cookies.naver_state;

  // if (!state || state !== savedState) {
  //   console.error("❌ CSRF 공격 의심: state 불일치");
  //   return res.status(403).send("잘못된 접근입니다.");
  // }

  console.log("프론트로부터 받은 데이터:", { code, state });

  if (typeof code === "string" && typeof state === "string") {
    try {
      const userId = await handleNaverLogin(code, state);

      const accessToken = jwt.sign({ id: userId }, config.jwtSecretKey, {
        expiresIn: "3m",
      });

      const refreshToken = jwt.sign(
        { id: userId },
        config.jwtRefreshSecretKey,
        {
          expiresIn: "14d",
        },
      );

      res.clearCookie("naver_state");
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: config.nodeEnv === "production",
        maxAge: 14 * 24 * 60 * 60 * 1000,
      });

      return res.json({ success: true, accessToken: accessToken });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "로그인 처리 중 에러가 발생했습니다.",
      });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, message: "잘못된 요청입니다." });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    console.warn("⚠️ 재발급 실패: 쿠키에 refresh_token이 존재하지 않음");
    return res.status(401).json({
      success: false,
      message: "재로그인이 필요합니다.",
    });
  }

  try {
    const payload = jwt.verify(refreshToken, config.jwtRefreshSecretKey);
    if (payload && typeof payload === "object" && "id" in payload) {
      const userId = payload.id;

      const newAccessToken = jwt.sign({ id: userId }, config.jwtSecretKey, {
        expiresIn: "3m",
      });

      console.log(
        `✅ [토큰 재발급 성공] 유저 ID: ${userId} - 새 Access Token 발행 완료`,
      );
      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    }

    return res
      .status(401)
      .json({ success: false, message: "잘못된 토큰 형식입니다." });
  } catch (error) {
    console.error("❌ Refresh JWT 검증 에러:", error);
    return res.status(401).json({
      success: false,
      message: "인증 세션이 만료되었습니다. 다시 로그인해주세요.",
    });
  }
};
