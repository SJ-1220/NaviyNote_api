import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const configSchema = z.object({
  PORT: z.coerce.number().default(8080),
  NAVER_CLIENT_ID: z.string().min(1, "네이버 아이디가 필요합니다."),
  NAVER_CLIENT_SECRET: z.string().min(1, "네이버 시크릿이 필요합니다."),
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
  port: data.PORT,
  naverClientId: data.NAVER_CLIENT_ID,
  naverClientSecret: data.NAVER_CLIENT_SECRET,
};
