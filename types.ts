export interface ExtractedData {
  filename: string;
  columns: string[];
  rows: (string | number | boolean | null)[][];
  summary?: string;
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