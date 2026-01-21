/**
 * Log Level Enumeration
 * Ordered by severity (lower value = less severe)
 * 
 * DEBUG < INFO < WARN < ERROR < FATAL
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

/**
 * Utility function to convert LogLevel to string representation
 */
export function logLevelToString(level: LogLevel): string {
  const levelMap: Record<LogLevel, string> = {
    [LogLevel.DEBUG]: "DEBUG",
    [LogLevel.INFO]: "INFO",
    [LogLevel.WARN]: "WARN",
    [LogLevel.ERROR]: "ERROR",
    [LogLevel.FATAL]: "FATAL",
  };
  return levelMap[level];
}

/**
 * Parse string to LogLevel
 */
export function parseLogLevel(level: string): LogLevel {
  const normalizedLevel = level.toUpperCase();
  const levelMap: Record<string, LogLevel> = {
    DEBUG: LogLevel.DEBUG,
    INFO: LogLevel.INFO,
    WARN: LogLevel.WARN,
    ERROR: LogLevel.ERROR,
    FATAL: LogLevel.FATAL,
  };

  if (!(normalizedLevel in levelMap)) {
    throw new Error(`Invalid log level: ${level}`);
  }

  return levelMap[normalizedLevel];
}

