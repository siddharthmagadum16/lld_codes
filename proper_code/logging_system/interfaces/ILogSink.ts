import { LogEntry } from "../entities/LogEntry";

/**
 * Interface for log sinks/destinations (Strategy Pattern)
 * Implements Open/Closed Principle - new sinks can be added without modifying existing code
 * 
 * Each sink is responsible for:
 * - Writing logs to its specific destination
 * - Managing its own resources (file handles, connections, etc.)
 * - Providing cleanup mechanism
 */
export interface ILogSink {
  /**
   * Unique identifier for this sink
   */
  readonly name: string;

  /**
   * Write a log entry to the sink's destination
   * Should be async to support non-blocking I/O operations
   * @param entry The log entry to write
   */
  write(entry: LogEntry): Promise<void>;

  /**
   * Flush any buffered data and release resources
   * Called during shutdown or when sink is removed
   */
  close(): Promise<void>;
}

