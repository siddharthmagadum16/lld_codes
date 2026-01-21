// Initialize the system
import { ConsoleSink, Logger, LogLevel, FileSink } from "./index";

const logger = Logger.getInstance();
logger.addSink(new ConsoleSink());
logger.addSink(new FileSink());

// Set global threshold to INFO (ignores DEBUG)
logger.setThreshold(LogLevel.INFO);

// Logging actions
logger.debug("This will be ignored"); 
logger.info("System started successfully");
logger.error("Failed to connect to Database");