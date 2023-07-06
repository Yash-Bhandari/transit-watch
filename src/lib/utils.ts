import { ReportingData } from "../types";

export const formatReport = (
  report: ReportingData,
  options = { includeTime: true }
): string => {
  const issues = report.issues.filter((issue) => issue.length > 0);
  let out = "";
  out += issues.join(", ") + " ";
  if (report.locationType === "station")
    out += `at ${report.station} Station\n`;
  if (report.locationType === "train")
    out += `\n${report.route}\n Next stop: ${report.nextStation}\n`;

  // format the current time as hh:mm am/pm
  if (report.locationDetails) out += `Location: ${report.locationDetails}\n`;
  if (report.details?.length > 1) out += `${report.details}`;
  if (options.includeTime) out += "\n" + currentTime;
  return out;
};

const currentTime =
  new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }) + "\n";
