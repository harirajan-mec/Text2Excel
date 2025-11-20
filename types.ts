export interface CalendarEvent {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
}

export interface ExtractedData {
  filename: string;
  columns: string[];
  rows: (string | number | boolean | null)[][];
  summary?: string;
  calendarEvent?: CalendarEvent;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ExcelGenerationConfig {
  includeSummary: boolean;
  autoFilter: boolean;
}