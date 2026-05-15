import { type Request, type Response } from "express";
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
  const { code, state } = req.query;
  const savedState = req.cookies.naver_state;

  if (!state || state !== savedState) {
    console.error("❌ CSRF 공격 의심: state 불일치");
    return res.status(403).send("잘못된 접근입니다.");
  }

  if (typeof code === "string" && typeof state === "string") {
    try {
      await handleNaverLogin(code, state);
      res.clearCookie("naver_state");
      res.send("🎉 네이버 로그인 성공!");
    } catch (error) {
      console.error(error);
      res.status(500).send("로그인 처리 중 에러가 발생했습니다.");
    }
  } else {
    res.status(400).send("잘못된 요청입니다.");
  }
};
