import { NextApiRequest } from "next";
import { getReport } from "../../../lib/activeReports";
import { APIException, withErrorHandling } from "../../../lib/apiUtils";

const getReportHandler = (req: NextApiRequest, res) => {
  const id = req.url.split("/").pop();
  const report = getReport(id);
  if (!report)
    throw new APIException("No report found with id " + id, "report_not_found");
  return res.status(200).json(report);
};

export default withErrorHandling(getReportHandler);
