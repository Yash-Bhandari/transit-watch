import { NextApiRequest, NextApiResponse } from "next";
import { sendSMS } from "../../lib/sms";
import { ReportingData } from "../../types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  const data: ReportingData = JSON.parse(body);
  console.log(data);
  sendSMS("Hello from " + data.station);
  return res.status(200).json({ message: "success" });
}
