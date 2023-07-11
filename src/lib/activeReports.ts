import ShortUniqueId from "short-unique-id";
import { ActiveReport, Message, ReportingData } from "../types";
import db from './database';

const reports = (db as Loki).getCollection<ActiveReport>("reports");
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
  value: number;
}
// const dataStore = {
//   reports: { test: testReport, test2: { ...testReport, id: "test2" } },
//   value: 0,
//   increment: function () {
//     this.value += 1;
//   },
//   getValue: function () {
//     return this.value;
//   },
// };

export function getReport(id: string): ActiveReport {
  console.log("tring to get report at id", id);
  const report = reports.findOne({ id });
  console.log(reports.find());
  return report;
}

export function addReport(data: ReportingData): ActiveReport {
  const id = generateReportId();
  const report: ActiveReport = {
    id,
    data,
    messages: [],
  };
  console.log("adding report at id", id);
  reports.insert(report);
  console.log("All reports", reports.find());
  db.saveDatabase();
  return report;
}

/** Returns true if message is added to data store */
export function addMessage(message: Message) {
  const reportId = message.reportId;
  const report = getReport(reportId);
  if (!report) return false;
  // ignore the message if it's a duplicate
  // messages can be sent multiple times in order to have an "at least once" delivery guarantee
  if (report.messages.some((m) => m.id === message.id)) return false;
  report.messages.push(message);
  reports.update(report);
  return true;
}

const uidGenerator = new ShortUniqueId({ length: 5 });

const generateReportId = () => {
  let id = uidGenerator.randomUUID();
  // make sure the id is unique, this has a ludicrously small chance of failing
  for (let i = 0; i < 5; i++) {
    if (id in reports.ensureId) {
      id = uidGenerator.randomUUID();
    }
  }
  return id;
};

export const deleteStaleReports = () => {
  const maxAgeMins = 30;
  const now = Date.now();
  reports.removeWhere((report) => now - report.data.timestamp > 1000 * 60 * maxAgeMins);
};
