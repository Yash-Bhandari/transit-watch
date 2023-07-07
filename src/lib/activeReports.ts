import ShortUniqueId from "short-unique-id";
import { Message, ReportingData } from "../types";

interface DataStore {
  reports: Record<string, ActiveReport>;
}

interface ActiveReport {
  id: string;
  data: ReportingData;
  messages: Message[];
}

const dataStore = {
  reports: {},
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
  if (!(reportId in dataStore.reports)) throw new Error("Report not found");
  dataStore.reports[reportId].messages.push(message);
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
