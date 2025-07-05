class Logger {
    private static instance: Logger | null = null;
    private static cntr: number = 0;

    private constructor() {
        console.log(`constructor called ${++Logger.cntr} times`);
    }

    static getSingleton(): Logger {
        if (Logger.instance === null) {
            // In TypeScript/JavaScript, we don't need explicit locks for single-threaded execution
            // For true thread safety with workers, you'd need additional synchronization
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
}

// Simulating concurrent access
async function createLogger1(): Promise<void> {
    const log = Logger.getSingleton();
    console.log("Logger1 created");
}

async function createLogger2(): Promise<void> {
    const log = Logger.getSingleton();
    console.log("Logger2 created");
}

// Main function
async function main(): Promise<void> {
    // Simulate concurrent execution
    const promises = [
        createLogger1(),
        createLogger2()
    ];

    await Promise.all(promises);
    console.log("Both loggers created");
}

// Execute main
main();

// Note: JavaScript is single-threaded in most contexts, so the double-checked locking
// pattern from C++ isn't necessary. For true multi-threading with Web Workers or
// Node.js Worker Threads, you'd need different synchronization mechanisms.