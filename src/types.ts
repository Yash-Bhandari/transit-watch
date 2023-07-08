export interface ReportingData {
  issues: string[];
  details?: string;
  locationType: "station" | "train";
  locationDetails?: string;
  station?: string;
  route?: string;
  nextStation?: string;
  timestamp: number;
}

export interface Message {
  id?: string;
  from: "reporter" | "responder";
  timestamp: Date;
  text: string;
  reportId: string;
}

export interface ActiveReport {
  id: string;
  data: ReportingData;
  messages: Message[];
}
