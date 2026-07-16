import { config } from "@/config/env.js";
import { prisma } from "@/config/prisma.js";
import axios from "axios";
import crypto from "crypto";

export const getNaverAuthUrl = () => {
  const state = crypto.randomBytes(16).toString("hex");
  const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${config.naverClientId}&redirect_uri=${config.naverCallbackUrl}&state=${state}`;
  return { state, url };
};

interface NaverTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: string;
}

interface NaverUserProfile {
  resultcode: string;
  message: string;
  response: {
    id: string;
    email: string;
    nickname: string;
    profile_image: string;
  };
}

export const handleNaverLogin = async (code: string, state: string) => {
  // 1. axios를 사용해 네이버 서버에 직접 토큰을 요청
  const { data } = await axios.get<NaverTokenResponse>(
    "https://nid.naver.com/oauth2.0/token",
    {
      params: {
        grant_type: "authorization_code",
        client_id: config.naverClientId,
        client_secret: config.naverClientSecret,
        redirect_uri: config.naverCallbackUrl,
        code: code,
        state: state,
      },
    },
  );
  // 2. 받은 네이버 토큰으로 유저 정보를 가져옴
  const header: string = "Bearer " + data.access_token;
  const info = await axios.get<NaverUserProfile>(
    "https://openapi.naver.com/v1/nid/me",
    { headers: { Authorization: header } },
  );
  const { id, profile_image, nickname, email } = info.data.response;
  console.log(`resultcode: ${info.data.resultcode}`);
  console.log(`message: ${info.data.message}`);
  console.log(`id: ${id}`);
  console.log(`email: ${email}`);
  console.log(`nickname: ${nickname}`);
  console.log(`profile_image: ${profile_image}`);

  // 3. Repository를 시켜서 DB에 저장
  await prisma.user.upsert({
    where: { id: id },
    update: {
      email: email,
      nickname: nickname,
      profileImage: profile_image,
    },
    create: {
      id: id,
      email: email,
      nickname: nickname,
      profileImage: profile_image,
    },
  });
  
  // 4. id로 JWT를 만들 수 있도록 controller에 전달
  return id;
};

export const getUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      profileImage: true,
    },
  });
};
