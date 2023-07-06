import { Message, ReportingData } from "../types";

interface DataStore {
  activeReports: ActiveReport[];
}

interface ActiveReport {
  id: string;
  data: ReportingData;
  messages: Message[];
}

const dataStore = {
  reports: [],
};
