export type ScriptType = 'drive-organizer' | 'gmail-ingestion' | 'enterprise-ledger';

export interface CardProfile {
  id: string;
  bankName: string;
  cardNumber: string; // last 4 digits
  password?: string;   // statement PDF password
  isActive: boolean;
}

export interface AppConfig {
  masterFolder: string;
  gmailSearchQuery: string;
  processedLabel: string;
  scanPeriodMonths: number;
  targetLedgerName: string;
  cards: CardProfile[];
}

export interface LogLine {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  text: string;
}

export interface Transaction {
  date: string;
  merchant: string;
  type: 'Debit' | 'Credit';
  amount: number;
  balance?: number;
  isDuplicate?: boolean;
  hash: string;
}

export interface CardStatementLog {
  cardName: string;
  fileName: string;
  fileSize: string;
  transactionsParsed: number;
  status: 'PROCESSED' | 'SKIPPED' | 'FAILED';
}
