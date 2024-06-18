import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { getLegalDongFromCoords } from "./getLegalDongFromCoords";
import { getShortForecast } from "./getShortForecast";
import { getUltraShortForecast } from "./getUltraShortForecast";

dotenv.config();

// Express 앱 생성
const app = express();

// 기본 포트 설정
const port = 4000;

// 기본 라우트 설정
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World with TypeScript!");
});

app.get("/weather/short-forecast", getShortForecast);
app.get("/weather/ultra-short-forecast", getUltraShortForecast);

app.get("/geolocation/legal-from-coords", getLegalDongFromCoords);

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
