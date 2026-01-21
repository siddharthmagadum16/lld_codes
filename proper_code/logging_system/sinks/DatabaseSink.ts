import { ILogSink } from "../interfaces/ILogSink";
import { LogEntry } from "../entities/LogEntry";
import { logLevelToString } from "../entities/LogLevel";

/**
 * Database Log Record structure
 */
interface DatabaseLogRecord {
  id: string;
  timestamp: Date;
  level: string;
  message: string;
  context?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Simple in-memory database adapter interface
 * In production, this would be replaced with actual database client
 */
interface IDatabaseAdapter {
  insert(tableName: string, record: DatabaseLogRecord): Promise<void>;
  close(): Promise<void>;
}

/**
 * In-Memory Database Adapter (for demo purposes)
 * Replace with actual database adapter (MongoDB, PostgreSQL, etc.)
 */
export class InMemoryDatabaseAdapter implements IDatabaseAdapter {
  private _records: Map<string, DatabaseLogRecord[]> = new Map();

  async insert(tableName: string, record: DatabaseLogRecord): Promise<void> {
    if (!this._records.has(tableName)) {
      this._records.set(tableName, []);
    }
    this._records.get(tableName)!.push(record);
  }

  async close(): Promise<void> {
    this._records.clear();
  }

  // Utility method to retrieve logs (for testing/demo)
  getRecords(tableName: string): DatabaseLogRecord[] {
    return this._records.get(tableName) ?? [];
  }
}

/**
 * Database Sink - Stores logs in a database
 * Uses batch inserts for better performance
 * Implements buffering with periodic flush
 */
export class DatabaseSink implements ILogSink {
  readonly name: string = "DatabaseSink";
  private readonly _adapter: IDatabaseAdapter;
  private readonly _tableName: string;
  private readonly _batchSize: number;
  private _buffer: DatabaseLogRecord[] = [];
  private _flushInterval: NodeJS.Timeout | null = null;
  private _isFlushing: boolean = false;
  private _idCounter: number = 0;

  constructor(options: {
    adapter: IDatabaseAdapter;
    tableName?: string;
    batchSize?: number;
    flushIntervalMs?: number;
  }) {
    this._adapter = options.adapter;
    this._tableName = options.tableName ?? "application_logs";
    this._batchSize = options.batchSize ?? 50;

    // Set up periodic flush
    const flushIntervalMs = options.flushIntervalMs ?? 5000;
    this._flushInterval = setInterval(() => this.flush(), flushIntervalMs);
  }

  async write(entry: LogEntry): Promise<void> {
    const record: DatabaseLogRecord = {
      id: this.generateId(),
      timestamp: entry.timestamp,
      level: logLevelToString(entry.level),
      message: entry.message,
      context: entry.context,
      metadata: entry.metadata,
    };

    this._buffer.push(record);

    // Flush if batch size reached
    if (this._buffer.length >= this._batchSize) {
      await this.flush();
    }
  }

  async close(): Promise<void> {
    if (this._flushInterval) {
      clearInterval(this._flushInterval);
      this._flushInterval = null;
    }

    await this.flush();
    await this._adapter.close();
  }

  private async flush(): Promise<void> {
    if (this._isFlushing || this._buffer.length === 0) {
      return;
    }

    this._isFlushing = true;
    const recordsToInsert = [...this._buffer];
    this._buffer = [];

    try {
      // Insert all records (in real implementation, use batch insert)
      for (const record of recordsToInsert) {
        await this._adapter.insert(this._tableName, record);
      }
    } catch (error) {
      console.error("DatabaseSink flush error:", error);
      // Re-add failed records to buffer for retry
      this._buffer.unshift(...recordsToInsert);
    } finally {
      this._isFlushing = false;
    }
  }

  private generateId(): string {
    this._idCounter++;
    return `log_${Date.now()}_${this._idCounter}`;
  }
}

