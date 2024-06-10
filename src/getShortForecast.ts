import axios from "axios";
import { Request, Response } from "express";

interface ShortForecastItem {
  time: string;
  SKY: string;
  PTY: string;
  TMP: string;
  POP: string;
}

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
      numOfRows: 285,
      pageNo: 1,
      base_date: baseDate,
      base_time: baseTime,
      nx,
      ny,
    };

    const response = await axios.get(apiUrl, { params });

    const getData = () => {
      const items = response.data.response.body.items.item;
      const filteredItems: { category: "SKY" | "PTY" | "TMP" | "POP"; fcstValue: string; fcstTime: string }[] =
        items.filter(
          (item: { category: string }) =>
            item.category === "SKY" || item.category === "PTY" || item.category === "TMP" || item.category === "POP"
        );

      const result = filteredItems.reduce<ShortForecastItem[]>((acc, item, index) => {
        if (index % 4 === 0) {
          acc.push({
            time: item.fcstTime,
            SKY: "",
            PTY: "",
            TMP: "",
            POP: "",
          });
        }

        acc[acc.length - 1][item.category] = item.fcstValue;

        return acc;
      }, []);

      return result;
    };

    res.json({ data: getData() });
  } catch (error) {
    res.status(500).send("Failed to fetch weather data");
  }
};
