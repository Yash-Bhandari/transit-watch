import { ReportingData } from "../types";

export const formatReport = (report: ReportingData): string => {
  const issues = report.issues.filter((issue) => issue.length > 0);
  let out = "";
  out += issues.join(", ") + " ";
  if (report.locationType === "station")
    out += `at ${report.station} Station\n`;

  // format the current time as hh:mm am/pm
  if (report.locationDetails) out += `Location: ${report.locationDetails}\n`;
  if (report.details) out += `${report.details}\n`;
  out += currentTime;
  return out;
};

const currentTime =
  new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }) + "\n";
