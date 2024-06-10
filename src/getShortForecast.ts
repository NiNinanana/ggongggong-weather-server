import axios from "axios";
import { Request, Response } from "express";

export const getShortForecast = async (req: Request, res: Response) => {
  const encodedServiceKey = process.env.GOV_DATA_API_KEY;
  const serviceKey = decodeURIComponent(encodedServiceKey as string);

  try {
    const { baseDate, baseTime, nx, ny } = req.query;

    if (!baseDate || !baseTime || !nx || !ny) return res.status(400).send("모든 정보가 입력되지 않았습니다.");

    const apiUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
    const params = {
      ServiceKey: serviceKey,
      dataType: "JSON",
      numOfRows: 1000,
      pageNo: 1,
      base_date: baseDate,
      base_time: baseTime,
      nx,
      ny,
    };

    const response = await axios.get(apiUrl, { params });

    res.json(response.data);
  } catch (error) {
    res.status(500).send("Failed to fetch weather data");
  }
};
