/*
factory design pattern is nothing but polymorphism with the using abstract base class
variable for many forms. and seperating creating a different class(factory) for building instances
of these child class based on user input
*/




#include <iostream>
#include <string>

using namespace std;

// LogLevel Enumeration
enum class LogLevel {
    DEBUG,
    INFO,
    ERROR
};

// ILogger Interface
class ILogger {
public:
    virtual void log(const string& msg) = 0; // Pure virtual function
    virtual ~ILogger() {} // Virtual destructor
};

// DebugLogger Class
class DebugLogger : public ILogger {
public:
    void log(const string& msg) override {
        cout << "DEBUG: " << msg << endl;
    }
};

// InfoLogger Class
class InfoLogger : public ILogger {
public:
    void log(const string& msg) override {
        cout << "INFO: " << msg << endl;
    }
};

// ErrorLogger Class
class ErrorLogger : public ILogger {
public:
    void log(const string& msg) override {
        cout << "ERROR: " << msg << endl;
    }
};

// LoggerFactory Class
class LoggerFactory {
public:
    static ILogger* createLogger(LogLevel pLogLevel) {
        if (pLogLevel == LogLevel::DEBUG)
            return new DebugLogger();
        if (pLogLevel == LogLevel::INFO)
            return new InfoLogger();
        if (pLogLevel == LogLevel::ERROR)
            return new ErrorLogger();
        return nullptr; // Return null if log level is unknown
    }
};

int main() {
    ILogger* debugLogger = LoggerFactory::createLogger(LogLevel::DEBUG);
    ILogger* infoLogger = LoggerFactory::createLogger(LogLevel::INFO);
    ILogger* errorLogger = LoggerFactory::createLogger(LogLevel::ERROR);

    debugLogger->log("This is a debug log message");
    infoLogger->log("This is an info log message");
    errorLogger->log("This is an error log message");

    // Clean up memory
    delete debugLogger;
    delete infoLogger;
    delete errorLogger;

    return 0;
}
