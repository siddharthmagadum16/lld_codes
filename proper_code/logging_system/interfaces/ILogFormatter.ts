import { LogEntry } from "../entities/LogEntry";

/**
 * Interface for log formatters (Strategy Pattern)
 * Allows different formatting strategies to be applied to log entries
 * 
 * Implementations can format logs as:
 * - Plain text with timestamps
 * - JSON format for structured logging
 * - Custom formats for specific requirements
 */
export interface ILogFormatter {
  /**
   * Format a log entry into a string representation
   * @param entry The log entry to format
   * @returns Formatted string representation of the log entry
   */
  format(entry: LogEntry): string;
}

