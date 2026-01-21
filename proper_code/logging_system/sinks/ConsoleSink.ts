import { ILogSink } from "../interfaces/ILogSink";
import { ILogFormatter } from "../interfaces/ILogFormatter";
import { LogEntry } from "../entities/LogEntry";
import { LogLevel } from "../entities/LogLevel";
import { DefaultFormatter } from "../formatters/DefaultFormatter";

/**
 * Console Sink - Outputs logs to the console
 * Uses different console methods based on log level for proper coloring in terminals
 */
export class ConsoleSink implements ILogSink {
  readonly name: string = "ConsoleSink";
  private readonly _formatter: ILogFormatter;
  private readonly _useColors: boolean;

  constructor(options?: { formatter?: ILogFormatter; useColors?: boolean }) {
    this._formatter = options?.formatter ?? new DefaultFormatter();
    this._useColors = options?.useColors ?? true;
  }

  async write(entry: LogEntry): Promise<void> {
    const formattedMessage = this._formatter.format(entry);
    const coloredMessage = this._useColors
      ? this.applyColor(formattedMessage, entry.level)
      : formattedMessage;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(coloredMessage);
        break;
      case LogLevel.INFO:
        console.info(coloredMessage);
        break;
      case LogLevel.WARN:
        console.warn(coloredMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(coloredMessage);
        break;
      default:
        console.log(coloredMessage);
    }
  }

  async close(): Promise<void> {
    // Console doesn't need cleanup
  }

  private applyColor(message: string, level: LogLevel): string {
    // ANSI color codes
    const colors: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: "\x1b[36m", // Cyan
      [LogLevel.INFO]: "\x1b[32m",  // Green
      [LogLevel.WARN]: "\x1b[33m",  // Yellow
      [LogLevel.ERROR]: "\x1b[31m", // Red
      [LogLevel.FATAL]: "\x1b[35m", // Magenta
    };
    const reset = "\x1b[0m";

    return `${colors[level]}${message}${reset}`;
  }
}

