import { NextApiRequest, NextApiResponse } from "next";
import { sendSMS } from "../../lib/sms";
import { formatReport } from "../../lib/utils";
import { ReportingData } from "../../types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  const data: ReportingData = JSON.parse(body);
  console.log(data);
  let text = formatReport(data);
  text += "\n View details at www.example.com/tw?id=a7bkdkdis"
  sendSMS(text);
  return res.status(200).json({ message: "success" });
}
