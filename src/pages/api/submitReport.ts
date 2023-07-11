import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { addReport } from "../../lib/activeReports";
import { APIException, withErrorHandling } from "../../lib/apiUtils";
import { formatReport } from "../../lib/utils";
import { ReportingData } from "../../types";

const submitReport = (req: NextApiRequest, res: NextApiResponse) => {
  const data = JSON.parse(req.body);
  const report = validateReport(data);
  let text = formatReport(data);
  const activeReport = addReport(report);
  text +=
    "\n Live chat here: " + getURL() + "/responders?id=" + activeReport.id;
  // sendSMS(text);
  return res.status(200).json(activeReport);
};

export default withErrorHandling(submitReport);

const validateReport = (data: any): ReportingData => {
  const { issues, locationType, locationDetails } = data;
  if (locationType !== "station" && locationType !== "route") {
    throw new APIException("Invalid location type", "report_invalid_location");
  }
  if (!issues || !issues.length) {
    throw new APIException("No issues provided", "report_no_issues");
  }
  if (!locationDetails) {
    throw new APIException(
      "No location details provided",
      "report_no_location"
    );
  }
  if (locationType === "station") {
    const { station } = data;
    if (!station) {
      throw new APIException("No station provided", "report_no_station");
    }
  }
  if (locationType === "train") {
    const { route, nextStation } = data;
    if (!route || !nextStation) {
      throw new APIException(
        "Route and next station required",
        "report_no_route_or_station"
      );
    }
  }
  const report = _.pick(data, [
    "issues",
    "locationType",
    "locationDetails",
    "station",
    "route",
    "nextStation",
    "timestamp",
  ]);
  return report;
};

const getURL = () => "192.168.0.16:3000";
