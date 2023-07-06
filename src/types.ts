export interface ReportingData {
  issues: string[];
  details?: string;
  locationType: string;
  locationDetails?: string;
  station?: string;
  route?: string;
  nextStation?: string;
}

export interface Message {
  from: "reporter" | "responder";
  timestamp: Date;
  text: string;
}