/**
 * Logging System Demo - Client File
 * 
 * This file demonstrates the complete functionality of the logging system:
 * 1. Singleton Logger initialization
 * 2. Multiple sinks (Console, File, Database)
 * 3. Different formatters (Default, JSON)
 * 4. Log level filtering
 * 5. Child loggers with context
 * 6. Concurrent logging (thread-safety)
 * 7. Adding new sinks without modifying existing code (Open/Closed Principle)
 */

import {
  Logger,
  LogLevel,
  ConsoleSink,
  FileSink,
  DatabaseSink,
  InMemoryDatabaseAdapter,
  CloudApiSink,
  DefaultFormatter,
  JsonFormatter,
} from "./index";
import * as path from "path";

// ============================================================
// Helper function to add delay for demo purposes
// ============================================================
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================
// Demo: Basic Logger Setup with Console Sink
// ============================================================
async function demoBasicLogging(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("DEMO 1: Basic Logging with Console Sink");
  console.log("=".repeat(60) + "\n");

  // Get singleton instance
  const logger = Logger.getInstance({
    minLevel: LogLevel.DEBUG,
    defaultContext: "Application",
    includeStackTrace: true,
  });

  // Add console sink with default formatter
  const consoleSink = new ConsoleSink({
    formatter: new DefaultFormatter(),
    useColors: true,
  });
  logger.addSink(consoleSink);

  // Log at different levels
  logger.debug("This is a debug message", "BasicDemo");
  logger.info("Application started successfully", "BasicDemo");
  logger.warn("Memory usage is high", "BasicDemo", { memoryUsage: "85%" });
  logger.error("Failed to connect to database", "BasicDemo", {
    host: "localhost",
    port: 5432,
  });
  logger.fatal("Critical system failure", "BasicDemo");

  // Wait for async operations to complete
  await logger.flush();
  await logger.removeSink("ConsoleSink");
}

// ============================================================
// Demo: Multiple Sinks (Console + File)
// ============================================================
async function demoMultipleSinks(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("DEMO 2: Multiple Sinks (Console + File)");
  console.log("=".repeat(60) + "\n");

  const logger = Logger.getInstance();

  // Console sink with colors
  const consoleSink = new ConsoleSink({
    formatter: new DefaultFormatter({ dateFormat: "locale" }),
    useColors: true,
  });
  logger.addSink(consoleSink);

  // File sink with JSON formatting
  const logFilePath = path.join(__dirname, "logs", "app.log");
  const fileSink = new FileSink({
    filePath: logFilePath,
    formatter: new JsonFormatter(),
    maxFileSize: 1024 * 1024, // 1MB
    maxBackupFiles: 3,
  });
  logger.addSink(fileSink);

  // Log messages
  logger.info("Logging to both console and file", "MultiSinkDemo");
  logger.warn("This warning appears in both destinations", "MultiSinkDemo");
  logger.error("Error logged to console AND file", "MultiSinkDemo", {
    errorCode: "E001",
    details: "Connection timeout",
  });

  await logger.flush();
  console.log(`\n📁 File logs written to: ${logFilePath}`);

  await logger.removeSink("ConsoleSink");
  await logger.removeSink("FileSink");
}

// ============================================================
// Demo: Database Sink
// ============================================================
async function demoDatabaseSink(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("DEMO 3: Database Sink (In-Memory)");
  console.log("=".repeat(60) + "\n");

  const logger = Logger.getInstance();

  // In-memory database adapter (for demo)
  const dbAdapter = new InMemoryDatabaseAdapter();
  const dbSink = new DatabaseSink({
    adapter: dbAdapter,
    tableName: "application_logs",
    batchSize: 5,
    flushIntervalMs: 1000,
  });
  logger.addSink(dbSink);

  // Also add console for visibility
  const consoleSink = new ConsoleSink({ useColors: true });
  logger.addSink(consoleSink);

  // Log messages
  logger.info("User logged in", "AuthService", { userId: "user_123" });
  logger.info("Order created", "OrderService", { orderId: "order_456" });
  logger.warn("Payment pending", "PaymentService", { amount: 99.99 });
  logger.error("Inventory low", "InventoryService", { productId: "prod_789", stock: 2 });
  logger.info("Email sent", "NotificationService", { recipient: "user@example.com" });

  await logger.flush();

  // Show database records
  console.log("\n📊 Database Records:");
  const records = dbAdapter.getRecords("application_logs");
  records.forEach((record, index) => {
    console.log(`  ${index + 1}. [${record.level}] ${record.message}`);
  });

  await logger.removeSink("DatabaseSink");
  await logger.removeSink("ConsoleSink");
}

// ============================================================
// Demo: Log Level Filtering
// ============================================================
async function demoLogLevelFiltering(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("DEMO 4: Log Level Filtering");
  console.log("=".repeat(60) + "\n");

  const logger = Logger.getInstance();
  const consoleSink = new ConsoleSink({ useColors: true });
  logger.addSink(consoleSink);

  console.log("Setting min level to ERROR...\n");
  logger.setMinLevel(LogLevel.ERROR);

  // These will be filtered out
  logger.debug("This DEBUG message will NOT appear");
  logger.info("This INFO message will NOT appear");
  logger.warn("This WARN message will NOT appear");

  // These will appear
  logger.error("This ERROR message WILL appear", "FilterDemo");
  logger.fatal("This FATAL message WILL appear", "FilterDemo");

  await logger.flush();

  // Reset to DEBUG level
  console.log("\nResetting min level to DEBUG...\n");
  logger.setMinLevel(LogLevel.DEBUG);

  logger.debug("Now DEBUG messages appear again", "FilterDemo");
  logger.info("And INFO messages too", "FilterDemo");

  await logger.flush();
  await logger.removeSink("ConsoleSink");
}

// ============================================================
// Demo: Child Loggers with Context
// ============================================================
async function demoChildLoggers(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("DEMO 5: Child Loggers with Context");
  console.log("=".repeat(60) + "\n");

  const logger = Logger.getInstance();
  const consoleSink = new ConsoleSink({ useColors: true });
  logger.addSink(consoleSink);

  // Create child loggers for different services
  const authLogger = logger.createChildLogger("AuthService");
  const orderLogger = logger.createChildLogger("OrderService");
  const paymentLogger = logger.createChildLogger("PaymentService");

  // Use child loggers - context is automatically included
  authLogger.info("User authentication started", { username: "john_doe" });
  authLogger.debug("Checking credentials");
  authLogger.info("User authenticated successfully", { sessionId: "sess_abc123" });

  orderLogger.info("Processing order", { orderId: "ORD-001" });
  orderLogger.warn("Stock running low for some items");

  paymentLogger.info("Payment initiated", { amount: 150.0, currency: "USD" });
  paymentLogger.error("Payment failed", { reason: "Insufficient funds" });

  await logger.flush();
  await logger.removeSink("ConsoleSink");
}

// ============================================================
// Demo: Concurrent Logging (Thread Safety)
// ============================================================
async function demoConcurrentLogging(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("DEMO 6: Concurrent Logging (Thread Safety)");
  console.log("=".repeat(60) + "\n");

  const logger = Logger.getInstance();
  const consoleSink = new ConsoleSink({ useColors: true });
  logger.addSink(consoleSink);

  // Simulate concurrent logging from multiple "threads"
  const tasks = Array.from({ length: 10 }, (_, i) => {
    const taskId = i + 1;
    return (async () => {
      logger.info(`Task ${taskId} started`, "ConcurrencyDemo", { taskId });
      await sleep(Math.random() * 100);
      logger.info(`Task ${taskId} processing`, "ConcurrencyDemo", { taskId });
      await sleep(Math.random() * 100);
      logger.info(`Task ${taskId} completed`, "ConcurrencyDemo", { taskId });
    })();
  });

  // All tasks run concurrently
  await Promise.all(tasks);
  await logger.flush();

  console.log("\n✅ All concurrent operations completed without data corruption");
  await logger.removeSink("ConsoleSink");
}

// ============================================================
// Demo: Open/Closed Principle - Adding New Sink
// ============================================================
async function demoOpenClosedPrinciple(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("DEMO 7: Open/Closed Principle - Adding Cloud API Sink");
  console.log("=".repeat(60) + "\n");

  const logger = Logger.getInstance();
  const consoleSink = new ConsoleSink({ useColors: true });
  logger.addSink(consoleSink);

  // Add a new CloudApiSink WITHOUT modifying existing code
  const cloudSink = new CloudApiSink({
    endpoint: "https://logs.example.com/api/v1/logs",
    apiKey: "demo-api-key-123",
    formatter: new JsonFormatter(),
    batchSize: 10,
    maxRetries: 3,
  });
  logger.addSink(cloudSink);

  console.log("CloudApiSink added - demonstrating Open/Closed Principle\n");

  // Log messages go to both Console and Cloud API
  logger.info("Application deployed", "Deployment", { version: "2.0.0", env: "production" });
  logger.warn("High CPU usage detected", "Monitoring", { cpuUsage: "92%" });
  logger.error("Service timeout", "API", { service: "payment-gateway", timeout: 30000 });

  await logger.flush();

  console.log("\n💡 Notice: CloudApiSink was added without changing Logger class!");
  console.log("   This demonstrates the Open/Closed Principle - open for extension,");
  console.log("   closed for modification.");

  await logger.removeSink("CloudApiSink");
  await logger.removeSink("ConsoleSink");
}

// ============================================================
// Demo: JSON Formatter for Structured Logging
// ============================================================
async function demoJsonFormatter(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("DEMO 8: JSON Formatter for Structured Logging");
  console.log("=".repeat(60) + "\n");

  const logger = Logger.getInstance();
  const consoleSink = new ConsoleSink({
    formatter: new JsonFormatter({ prettyPrint: true }),
    useColors: false,
  });
  logger.addSink(consoleSink);

  logger.info("Structured log entry", "JsonDemo", {
    userId: "user_123",
    action: "login",
    ip: "192.168.1.100",
    userAgent: "Mozilla/5.0",
    success: true,
  });

  await logger.flush();
  await logger.removeSink("ConsoleSink");
}

// ============================================================
// Main Entry Point
// ============================================================
async function main(): Promise<void> {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║         LOGGING SYSTEM - DEMONSTRATION                     ║");
  console.log("║                                                            ║");
  console.log("║  Features:                                                 ║");
  console.log("║  • Singleton Pattern (single logger instance)              ║");
  console.log("║  • Strategy Pattern (pluggable sinks & formatters)         ║");
  console.log("║  • Open/Closed Principle (extensible without modification) ║");
  console.log("║  • Thread-safe async operations                            ║");
  console.log("║  • Log level filtering                                     ║");
  console.log("╚════════════════════════════════════════════════════════════╝");

  try {
    await demoBasicLogging();
    await sleep(500);

    await demoMultipleSinks();
    await sleep(500);

    await demoDatabaseSink();
    await sleep(500);

    await demoLogLevelFiltering();
    await sleep(500);

    await demoChildLoggers();
    await sleep(500);

    await demoConcurrentLogging();
    await sleep(500);

    await demoOpenClosedPrinciple();
    await sleep(500);

    await demoJsonFormatter();

    // Cleanup
    console.log("\n" + "=".repeat(60));
    console.log("Shutting down logger...");
    console.log("=".repeat(60) + "\n");

    await Logger.resetInstance();
    console.log("✅ Logger shutdown complete. All demos finished successfully!");

  } catch (error) {
    console.error("Demo error:", error);
    process.exit(1);
  }
}

// Run the demo
main();

