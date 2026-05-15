import { config } from "@/config/env.js";
import axios from "axios";
import crypto from "crypto";

const naverCallbackUrl = "http://localhost:8080/api/auth/naver/callback";

export const getNaverAuthUrl = () => {
  const state = crypto.randomBytes(16).toString("hex");
  const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${config.naverClientId}&redirect_uri=${naverCallbackUrl}&state=${state}`;
  return { state, url };
};

interface NaverTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: string;
}
export const handleNaverLogin = async (code: string, state: string) => {
  // 2. 여기서 fetch 등을 사용해 네이버 서버에 직접 토큰을 요청합니다.
  const { data } = await axios.get<NaverTokenResponse>(
    "https://nid.naver.com/oauth2.0/token",
    {
      params: {
        grant_type: "authorization_code",
        client_id: config.naverClientId,
        client_secret: config.naverClientSecret,
        redirect_uri: naverCallbackUrl,
        code: code,
        state: state,
      },
    },
  );

  // 3. 받은 네이버 토큰으로 유저 정보를 가져옵니다.
  // 4. 우리 서버 전용 JWT를 생성합니다.
  // 5. Repository를 시켜서 DB에 저장합니다.
};
