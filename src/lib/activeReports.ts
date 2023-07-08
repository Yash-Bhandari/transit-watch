import ShortUniqueId from "short-unique-id";
import { ActiveReport, Message, ReportingData } from "../types";
import { APIException } from "./apiUtils";

interface DataStore {
  reports: Record<string, ActiveReport>;
}

const testReport: ActiveReport = {
  id: "test",
  data: {
    issues: ["test issue"],
    locationType: "station",
    station: "Corona Station",
    timestamp: Date.now() - 1000 * 60 * 5,
    locationDetails: "On the platform",
  },
  messages: [],
};

interface DataStore {
  reports: Record<string, ActiveReport>;
}
const dataStore: DataStore = {
  reports: { test: testReport },
};

const getReport = (id: string): ActiveReport => {
  return dataStore.reports[id];
};

const addReport = (data: ReportingData): ActiveReport => {
  const id = generateReportId();
  const report = {
    id,
    data,
    messages: [],
  };
  dataStore.reports[id] = report;
  return report;
};

const addMessage = (reportId: string, message: Message) => {
  if (!(reportId in dataStore.reports))
    throw new APIException(
      "Report with id " + reportId + " not found",
      "report_not_found"
    );
  const report = dataStore.reports[reportId];
  // ignore the message if it's a duplicate
  // messages can be sent multiple times in order to have an "at least once" delivery guarantee
  if (report.messages.some((m) => m.id === message.id)) return;
};

const uidGenerator = new ShortUniqueId({ length: 5 });

const generateReportId = () => {
  let id = uidGenerator.randomUUID();
  // make sure the id is unique, this has a ludicrously small chance of failing
  for (let i = 0; i < 5; i++) {
    if (id in dataStore.reports) {
      id = uidGenerator.randomUUID();
    }
  }
  return id;
};

export { addMessage, addReport, getReport };

