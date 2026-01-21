import { ILogSink } from "../interfaces/ILogSink";
import { LogEntry } from "../entities/LogEntry";
import { LogLevel } from "../entities/LogLevel";
import { AsyncQueue } from "./AsyncQueue";

/**
 * Logger Configuration Options
 */
export interface LoggerConfig {
  /**
   * Minimum log level to process (default: DEBUG)
   * Logs below this level will be ignored
   */
  minLevel?: LogLevel;

  /**
   * Default context to use when none is provided
   */
  defaultContext?: string;

  /**
   * Whether to include stack trace for ERROR and FATAL logs
   */
  includeStackTrace?: boolean;
}

/**
 * Singleton Logger - Central logging service
 * 
 * Design Patterns Used:
 * 1. Singleton Pattern - Single instance across the application
 * 2. Strategy Pattern - Pluggable sinks and formatters
 * 3. Observer Pattern - Multiple sinks can observe log events
 * 
 * Thread Safety:
 * - Uses AsyncQueue to serialize log operations
 * - Prevents race conditions in async environments
 * 
 * Features:
 * - Multiple sinks support
 * - Log level filtering
 * - Context-aware logging
 * - Child loggers with inherited configuration
 */
export class Logger {
  private static _instance: Logger | null = null;
  private static _initLock: Promise<void> | null = null;

  private readonly _sinks: Map<string, ILogSink> = new Map();
  private readonly _asyncQueue: AsyncQueue;
  private _minLevel: LogLevel;
  private _defaultContext?: string;
  private _includeStackTrace: boolean;
  private _isShuttingDown: boolean = false;

  /**
   * Private constructor - use getInstance() instead
   */
  private constructor(config?: LoggerConfig) {
    this._asyncQueue = new AsyncQueue();
    this._minLevel = config?.minLevel ?? LogLevel.DEBUG;
    this._defaultContext = config?.defaultContext;
    this._includeStackTrace = config?.includeStackTrace ?? false;
  }

  /**
   * Get the singleton Logger instance
   * Thread-safe initialization using double-check locking pattern
   */
  static getInstance(config?: LoggerConfig): Logger {
    if (!Logger._instance) {
      Logger._instance = new Logger(config);
    }
    return Logger._instance;
  }

  /**
   * Reset the singleton instance (useful for testing)
   */
  static async resetInstance(): Promise<void> {
    if (Logger._instance) {
      await Logger._instance.shutdown();
      Logger._instance = null;
    }
  }

  /**
   * Add a sink to the logger
   * @param sink The sink to add
   */
  addSink(sink: ILogSink): void {
    if (this._isShuttingDown) {
      throw new Error("Cannot add sink: Logger is shutting down");
    }
    this._sinks.set(sink.name, sink);
  }

  /**
   * Remove a sink from the logger
   * @param sinkName The name of the sink to remove
   */
  async removeSink(sinkName: string): Promise<void> {
    const sink = this._sinks.get(sinkName);
    if (sink) {
      await sink.close();
      this._sinks.delete(sinkName);
    }
  }

  /**
   * Get a registered sink by name
   * @param sinkName The name of the sink
   */
  getSink(sinkName: string): ILogSink | undefined {
    return this._sinks.get(sinkName);
  }

  /**
   * Set the minimum log level
   * @param level The minimum level to log
   */
  setMinLevel(level: LogLevel): void {
    this._minLevel = level;
  }

  /**
   * Get the current minimum log level
   */
  getMinLevel(): LogLevel {
    return this._minLevel;
  }

  /**
   * Create a child logger with a specific context
   * Inherits parent configuration but allows context-specific logging
   */
  createChildLogger(context: string): ChildLogger {
    return new ChildLogger(this, context);
  }

  /**
   * Log a DEBUG message
   */
  debug(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context, metadata);
  }

  /**
   * Log an INFO message
   */
  info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context, metadata);
  }

  /**
   * Log a WARN message
   */
  warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context, metadata);
  }

  /**
   * Log an ERROR message
   */
  error(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, metadata);
  }

  /**
   * Log a FATAL message
   */
  fatal(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.FATAL, message, context, metadata);
  }

  /**
   * Core logging method
   * Thread-safe through AsyncQueue
   */
  log(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: Record<string, unknown>
  ): void {
    // Level filtering
    if (level < this._minLevel) {
      return;
    }

    if (this._isShuttingDown) {
      return;
    }

    // Enhance metadata with stack trace for errors
    let enhancedMetadata = metadata;
    if (this._includeStackTrace && (level === LogLevel.ERROR || level === LogLevel.FATAL)) {
      enhancedMetadata = {
        ...metadata,
        stackTrace: new Error().stack,
      };
    }

    const entry = new LogEntry(
      level,
      message,
      context ?? this._defaultContext,
      enhancedMetadata
    );

    // Enqueue the write operation for thread-safety
    this._asyncQueue.enqueue(async () => {
      await this.writeToAllSinks(entry);
    });
  }

  /**
   * Write a log entry to all registered sinks
   */
  private async writeToAllSinks(entry: LogEntry): Promise<void> {
    const writePromises = Array.from(this._sinks.values()).map(async (sink) => {
      try {
        await sink.write(entry);
      } catch (error) {
        // Log sink errors to console to avoid infinite recursion
        console.error(`Error writing to sink ${sink.name}:`, error);
      }
    });

    await Promise.all(writePromises);
  }

  /**
   * Wait for all pending log operations to complete
   */
  async flush(): Promise<void> {
    await this._asyncQueue.drain();
  }

  /**
   * Shutdown the logger gracefully
   * Flushes pending logs and closes all sinks
   */
  async shutdown(): Promise<void> {
    this._isShuttingDown = true;

    // Wait for pending operations
    await this._asyncQueue.drain();

    // Close all sinks
    const closePromises = Array.from(this._sinks.values()).map(async (sink) => {
      try {
        await sink.close();
      } catch (error) {
        console.error(`Error closing sink ${sink.name}:`, error);
      }
    });

    await Promise.all(closePromises);
    this._sinks.clear();
  }
}

/**
 * Child Logger - Context-specific logger that delegates to parent
 * Provides convenient logging with a fixed context
 */
export class ChildLogger {
  private readonly _parent: Logger;
  private readonly _context: string;

  constructor(parent: Logger, context: string) {
    this._parent = parent;
    this._context = context;
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this._parent.debug(message, this._context, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this._parent.info(message, this._context, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this._parent.warn(message, this._context, metadata);
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    this._parent.error(message, this._context, metadata);
  }

  fatal(message: string, metadata?: Record<string, unknown>): void {
    this._parent.fatal(message, this._context, metadata);
  }
}

