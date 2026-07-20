import authRoutes from "@/modules/auth/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { authenticateUser } from "./middleware/authenticateUser.js";
import todoRoutes from "./modules/todo/todo.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.get("/test/middleware", authenticateUser, (req, res) => {
  const userId = res.locals.userId;
  console.log(`[인증 성공] 유저 ID 추출 완료: ${userId}`);
  return res.json({
    success: true,
    userId: userId,
  });
});

export default app;
