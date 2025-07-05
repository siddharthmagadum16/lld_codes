/*
factory design pattern is nothing but polymorphism with the using abstract base class
variable for many forms. and seperating creating a different class(factory) for building instances
of these child class based on user input
*/

// LogLevel Enumeration
enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    ERROR = "ERROR"
}

// ILogger Interface
interface ILogger {
    log(msg: string): void;
}

// DebugLogger Class
class DebugLogger implements ILogger {
    log(msg: string): void {
        console.log(`DEBUG: ${msg}`);
    }
}

// InfoLogger Class
class InfoLogger implements ILogger {
    log(msg: string): void {
        console.log(`INFO: ${msg}`);
    }
}

// ErrorLogger Class
class ErrorLogger implements ILogger {
    log(msg: string): void {
        console.log(`ERROR: ${msg}`);
    }
}

// LoggerFactory Class
class LoggerFactory {
    static createLogger(pLogLevel: LogLevel): ILogger | null {
        if (pLogLevel === LogLevel.DEBUG)
            return new DebugLogger();
        if (pLogLevel === LogLevel.INFO)
            return new InfoLogger();
        if (pLogLevel === LogLevel.ERROR)
            return new ErrorLogger();
        return null; // Return null if log level is unknown
    }
}

// Main function
function main(): void {
    const debugLogger = LoggerFactory.createLogger(LogLevel.DEBUG);
    const infoLogger = LoggerFactory.createLogger(LogLevel.INFO);
    const errorLogger = LoggerFactory.createLogger(LogLevel.ERROR);

    if (debugLogger) debugLogger.log("This is a debug log message");
    if (infoLogger) infoLogger.log("This is an info log message");
    if (errorLogger) errorLogger.log("This is an error log message");
}

// Execute main
main();