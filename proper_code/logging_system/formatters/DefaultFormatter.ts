import { ILogFormatter } from "../interfaces/ILogFormatter";
import { LogEntry } from "../entities/LogEntry";
import { logLevelToString } from "../entities/LogLevel";

/**
 * Default log formatter that produces human-readable output
 * Format: [TIMESTAMP] [LEVEL] [CONTEXT] MESSAGE {METADATA}
 * 
 * Example: [2024-01-15T10:30:45.123Z] [INFO] [UserService] User logged in {"userId": "123"}
 */
export class DefaultFormatter implements ILogFormatter {
  private readonly _dateFormat: "iso" | "locale" | "unix";
  private readonly _includeMetadata: boolean;

  constructor(options?: { dateFormat?: "iso" | "locale" | "unix"; includeMetadata?: boolean }) {
    this._dateFormat = options?.dateFormat ?? "iso";
    this._includeMetadata = options?.includeMetadata ?? true;
  }

  format(entry: LogEntry): string {
    const parts: string[] = [];

    // Timestamp
    parts.push(`[${this.formatTimestamp(entry.timestamp)}]`);

    // Level
    parts.push(`[${logLevelToString(entry.level).padEnd(5)}]`);

    // Context (if present)
    if (entry.context) {
      parts.push(`[${entry.context}]`);
    }

    // Message
    parts.push(entry.message);

    // Metadata (if present and enabled)
    if (this._includeMetadata && entry.metadata && Object.keys(entry.metadata).length > 0) {
      parts.push(JSON.stringify(entry.metadata));
    }

    return parts.join(" ");
  }

  private formatTimestamp(date: Date): string {
    switch (this._dateFormat) {
      case "locale":
        return date.toLocaleString();
      case "unix":
        return date.getTime().toString();
      case "iso":
      default:
        return date.toISOString();
    }
  }
}

