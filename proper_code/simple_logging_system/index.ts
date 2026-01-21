// 1. Define Log Levels
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  ERROR = 2
}

// 2. The Sink Interface (Strategy Pattern)
interface ILogSink {
  send(message: string, level: LogLevel): void;
}

// 3. Concrete Sinks
class ConsoleSink implements ILogSink {
  send(message: string, level: LogLevel): void {
    console.log(`[Console] ${LogLevel[level]}: ${message}`);
  }
}

class FileSink implements ILogSink {
  send(message: string, level: LogLevel): void {
    // Simulated file write
    console.log(`[File] Writing to log.txt: ${message}`);
  }
}

// 4. The Log Manager (Singleton)
class Logger {
  private static instance: Logger;
  private sinks: ILogSink[] = [];
  private levelThreshold: LogLevel = LogLevel.DEBUG;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setThreshold(level: LogLevel): void {
    this.levelThreshold = level;
  }

  public addSink(sink: ILogSink): void {
    this.sinks.push(sink);
  }

  public log(level: LogLevel, message: string): void {
    if (level < this.levelThreshold) return;

    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${message}`;

    this.sinks.forEach(sink => sink.send(formattedMessage, level));
  }

  // Helper methods
  public info(msg: string) { this.log(LogLevel.INFO, msg); }
  public error(msg: string) { this.log(LogLevel.ERROR, msg); }
  public debug(msg: string) { this.log(LogLevel.DEBUG, msg); }
}

export { Logger, LogLevel, ConsoleSink, FileSink }