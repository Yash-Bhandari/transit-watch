import { ReportingData } from "../types";

const submitReport = (report: ReportingData) => {
  return fetch("/api/submitReport", {
    method: "POST",
    body: JSON.stringify(report),
  });
};

const apiClient = { submitReport };
export default apiClient;
