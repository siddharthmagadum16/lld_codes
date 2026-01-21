import { ILogFormatter } from "../interfaces/ILogFormatter";
import { LogEntry } from "../entities/LogEntry";
import { logLevelToString } from "../entities/LogLevel";

/**
 * JSON log formatter for structured logging
 * Useful for log aggregation systems (ELK stack, Splunk, etc.)
 * 
 * Output format:
 * {"timestamp":"2024-01-15T10:30:45.123Z","level":"INFO","message":"...","context":"...","metadata":{...}}
 */
export class JsonFormatter implements ILogFormatter {
  private readonly _prettyPrint: boolean;
  private readonly _includeTimestampMs: boolean;

  constructor(options?: { prettyPrint?: boolean; includeTimestampMs?: boolean }) {
    this._prettyPrint = options?.prettyPrint ?? false;
    this._includeTimestampMs = options?.includeTimestampMs ?? false;
  }

  format(entry: LogEntry): string {
    const logObject: Record<string, unknown> = {
      timestamp: entry.timestamp.toISOString(),
      level: logLevelToString(entry.level),
      message: entry.message,
    };

    if (this._includeTimestampMs) {
      logObject.timestampMs = entry.timestamp.getTime();
    }

    if (entry.context) {
      logObject.context = entry.context;
    }

    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      logObject.metadata = entry.metadata;
    }

    return this._prettyPrint
      ? JSON.stringify(logObject, null, 2)
      : JSON.stringify(logObject);
  }
}

