import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const configSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(8080),
  NAVER_CLIENT_ID: z.string().min(1, "네이버 아이디가 필요합니다."),
  NAVER_CLIENT_SECRET: z.string().min(1, "네이버 시크릿이 필요합니다."),
  DATABASE_URL: z.string().min(1, "데이터베이스 주소가 필요합니다."),
  JWT_SECRET_KEY: z.string().min(1, "JWT 키가 필요합니다."),
  JWT_REFRESH_SECRET_KEY: z.string().min(1, "JWT 키가 필요합니다."),
  NAVER_CALLBACK_URL: z
    .string()
    .min(1, "네이버 로그인 콜백 주소가 필요합니다.")
    .default("http://localhost:8080/api/auth/naver/callback"),
  SERVER_URL: z
    .string()
    .min(1, "서버 주소가 필요합니다.")
    .default("http://localhost:8080"),
});

const parsedEnv = configSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ 환경변수 검증 실패:",
    z.flattenError(parsedEnv.error).fieldErrors,
  );
  process.exit(1);
}

const data = parsedEnv.data;
export const config = {
  nodeEnv: data.NODE_ENV,
  port: data.PORT,
  naverClientId: data.NAVER_CLIENT_ID,
  naverClientSecret: data.NAVER_CLIENT_SECRET,
  databaseUrl: data.DATABASE_URL,
  jwtSecretKey: data.JWT_SECRET_KEY,
  jwtRefreshSecretKey: data.JWT_REFRESH_SECRET_KEY,
  naverCallbackUrl: data.NAVER_CALLBACK_URL,
  serverUrl: data.SERVER_URL,
};
