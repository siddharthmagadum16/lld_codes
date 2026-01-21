import { LogLevel } from "./LogLevel";

/**
 * Represents a single log entry with all metadata
 * Immutable by design - once created, cannot be modified
 */
export class LogEntry {
  private readonly _timestamp: Date;
  private readonly _level: LogLevel;
  private readonly _message: string;
  private readonly _context?: string;
  private readonly _metadata?: Record<string, unknown>;

  constructor(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: Record<string, unknown>
  ) {
    this._timestamp = new Date();
    this._level = level;
    this._message = message;
    this._context = context;
    this._metadata = metadata ? { ...metadata } : undefined;
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  get level(): LogLevel {
    return this._level;
  }

  get message(): string {
    return this._message;
  }

  get context(): string | undefined {
    return this._context;
  }

  get metadata(): Record<string, unknown> | undefined {
    return this._metadata ? { ...this._metadata } : undefined;
  }
}

