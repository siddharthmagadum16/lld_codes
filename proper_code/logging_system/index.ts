/**
 * Logging System - A pluggable, extensible logging library
 * 
 * Features:
 * - Multiple log levels (DEBUG, INFO, WARN, ERROR, FATAL)
 * - Pluggable sinks (Console, File, Database, Cloud API)
 * - Custom formatters (Default, JSON)
 * - Thread-safe async operations
 * - Log level filtering
 * - Child loggers with context
 * 
 * Design Patterns:
 * - Singleton (Logger instance)
 * - Strategy (Sinks, Formatters)
 * - Observer (Multiple sinks)
 * - Template Method (Formatting)
 * 
 * SOLID Principles:
 * - Single Responsibility: Each class has one job
 * - Open/Closed: New sinks/formatters without modifying existing code
 * - Liskov Substitution: All sinks/formatters are interchangeable
 * - Interface Segregation: Small, focused interfaces
 * - Dependency Inversion: Logger depends on abstractions
 */

// Entities
export { LogLevel, logLevelToString, parseLogLevel } from "./entities/LogLevel";
export { LogEntry } from "./entities/LogEntry";

// Interfaces
export type { ILogFormatter } from "./interfaces/ILogFormatter";
export type { ILogSink } from "./interfaces/ILogSink";

// Formatters
export { DefaultFormatter } from "./formatters/DefaultFormatter";
export { JsonFormatter } from "./formatters/JsonFormatter";

// Sinks
export { ConsoleSink } from "./sinks/ConsoleSink";
export { FileSink } from "./sinks/FileSink";
export { DatabaseSink, InMemoryDatabaseAdapter } from "./sinks/DatabaseSink";
export { CloudApiSink } from "./sinks/CloudApiSink";

// Services
export { Logger, ChildLogger, type LoggerConfig } from "./services/Logger";
export { AsyncQueue } from "./services/AsyncQueue";

