import axios from "axios";
import dayjs from "dayjs";
import { Request, Response } from "express";

interface UltraShortForecastItem {
  time: string;
  SKY: string; // 하늘상태
  PTY: string; // 강수형태
  T1H: string; // 기온
}

export const getUltraShortForecast = async (req: Request, res: Response) => {
  const encodedServiceKey = process.env.GOV_DATA_API_KEY;
  const serviceKey = decodeURIComponent(encodedServiceKey as string);

  try {
    const { baseDate, baseTime, nx, ny } = req.query;

    if (!baseDate || !baseTime || !nx || !ny) return res.status(400).send("모든 정보가 입력되지 않았습니다.");

    const apiUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";
    const params = {
      ServiceKey: serviceKey,
      dataType: "JSON",
      numOfRows: 60,
      pageNo: 1,
      base_date: baseDate,
      base_time: baseTime,
      nx,
      ny,
    };

    const response = await axios.get(apiUrl, { params });

    const today = dayjs().format("YYYYMMDD");

    const getData = () => {
      const items = response.data.response.body.items.item;
      const filteredItems: { category: "SKY" | "PTY" | "T1H"; fcstValue: string; fcstTime: string }[] = items
        .filter((item: { baseTime: string; fcstTime: string }) => {
          const baseTimeWithToday = dayjs(`${today} ${item.baseTime}`, "YYYYMMDD HHmm");
          const baseTimeAdded30Minutes = baseTimeWithToday.add(30, "minute").format("HHmm");

          if (baseTimeAdded30Minutes === item.fcstTime) return true;
        })
        .filter(
          (item: { category: string }) => item.category === "SKY" || item.category === "PTY" || item.category === "T1H"
        );

      const result = filteredItems.reduce<Partial<UltraShortForecastItem>>((acc, item) => {
        const { fcstTime, category, fcstValue } = item;
        acc.time = fcstTime;
        acc[category] = fcstValue;
        return acc;
      }, {});

      return result;
    };

    res.json({ data: getData() });
  } catch (error) {
    res.status(500).send("Failed to fetch weather data");
  }
};
