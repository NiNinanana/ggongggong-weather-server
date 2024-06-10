import express, { Request, Response } from "express";

// Express 앱 생성
const app = express();

// 기본 포트 설정
const port = 4000;

// 기본 라우트 설정
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World with TypeScript!");
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
