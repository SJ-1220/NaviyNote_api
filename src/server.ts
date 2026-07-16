import app from "@/app.js";
import { config } from "@/config/env.js";

app.listen(config.port, () => {
  console.log(`${config.port}번 포트에서 서버 대기중`);
});
