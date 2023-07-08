import { ActiveReport, ReportingData } from "../types";

const submitReport = async (report: ReportingData) => {
  const resp = await fetch("/api/submitReport", {
    method: "POST",
    body: JSON.stringify(report),
  });
  return resp.json() as Promise<ActiveReport>;
};

const fetchReport = (id: string) => {
  return fetch(`/api/reports/${id}`);
};

const apiClient = { submitReport, fetchReport };
export default apiClient;
