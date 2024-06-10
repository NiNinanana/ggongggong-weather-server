import axios from "axios";
import { Request, Response } from "express";

export const getLegalDongFromCoords = async (req: Request, res: Response) => {
  const clientId = process.env.NCP_CLIENT_ID;
  const clientSecret = process.env.NCP_CLIENT_SECRET;

  const { coords } = req.query;

  if (!coords) {
    return res.status(400).json({ error: "Coords parameter is required" });
  }

  try {
    const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${coords}&orders=legalcode&output=json`;

    const { data } = await axios.get(url, {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": clientId,
        "X-NCP-APIGW-API-KEY": clientSecret,
      },
    });

    res.json({ legalDong: data.results[0].region.area3.name });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch legalDong data");
  }
};
