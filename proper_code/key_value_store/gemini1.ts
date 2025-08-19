// Gemini Solution. Uses Command pattern.

// Define the commands
interface ICommand {
    execute(store: Map<string, string>): void;
    // For rollback, we can have a compensate method but for simplicity
    // we just discard the command objects.
}
class PutCommand implements ICommand {
    constructor(private key: string, private value: string) {}
    execute(store: Map<string, string>): void {
        store.set(this.key, this.value);
    }
}
class DeleteCommand implements ICommand {
    constructor(private key: string) {}
    execute(store: Map<string, string>): void {
        store.delete(this.key);
    }
}
// Represents a single transaction level
class Transaction {
    private changes: Map<string, string | null>;
    private commands: ICommand[];
    constructor(parentChanges?: Map<string, string | null>) {
        // Initialize with parent's changes for nested transactions
        this.changes = parentChanges ? new Map(parentChanges) : new Map();
        this.commands = [];
    }
    put(key: string, value: string): void {
        this.commands.push(new PutCommand(key, value));
        this.changes.set(key, value);
    }
    delete(key: string): void {
        this.commands.push(new DeleteCommand(key));
        this.changes.set(key, null); // Null marks a deletion
    }
    get(key: string): string | undefined {
        const value = this.changes.get(key);
        return value === null ? undefined : value;
    }
    getCommands(): ICommand[] {
        return this.commands;
    }
    getChanges(): Map<string, string | null> {
        return this.changes;
    }
}
// Manages the transaction state for a given execution context
class TransactionManager {
    private transactionStack: Transaction[] = [];
    beginTransaction(): void {
        const parentChanges = this.transactionStack.length > 0
            ? this.transactionStack[this.transactionStack.length - 1].getChanges()
            : undefined;
        this.transactionStack.push(new Transaction(parentChanges));
        console.log(`Began new transaction. Depth: ${this.transactionStack.length}`);
    }
    commit(globalStore: Map<string, string>): void {
        if (this.transactionStack.length === 0) {
            console.error("No active transaction to commit.");
            return;
        }
        const currentTransaction = this.transactionStack.pop()!;
        if (this.transactionStack.length === 0) {
            // Top-level commit: apply commands to the global store
            console.log("Committing top-level transaction to global store.");
            for (const command of currentTransaction.getCommands()) {
                command.execute(globalStore);
            }
        } else {
            // Nested commit: merge changes into the parent transaction
            const parentTransaction = this.transactionStack[this.transactionStack.length - 1];
            console.log("Committing nested transaction to parent.");
            for (const [key, value] of currentTransaction.getChanges()) {
                parentTransaction.put(key, value as string); // Re-applying logic with parent
            }
        }
    }
    rollback(): void {
        if (this.transactionStack.length === 0) {
            console.error("No active transaction to rollback.");
            return;
        }
        this.transactionStack.pop();
        console.log(`Rolled back transaction. New depth: ${this.transactionStack.length}`);
    }
    getActiveTransaction(): Transaction | undefined {
        if (this.transactionStack.length > 0) {
            return this.transactionStack[this.transactionStack.length - 1];
        }
        return undefined;
    }
}

class KeyValueStore {
    private static instance: KeyValueStore;
    private store: Map<string, string> = new Map();
    // Use a WeakMap to associate each 'context' (e.g., a thread) with its own TransactionManager
    private managers = new WeakMap<object, TransactionManager>();
    // Singleton pattern to ensure only one global store instance exists
    private constructor() {}
    public static getInstance(): KeyValueStore {
        if (!KeyValueStore.instance) {
            KeyValueStore.instance = new KeyValueStore();
        }
        return KeyValueStore.instance;
    }
    private getTransactionManager(context: object): TransactionManager {
        if (!this.managers.has(context)) {
            this.managers.set(context, new TransactionManager());
        }
        return this.managers.get(context)!;
    }
    beginTransaction(context: object): void {
        this.getTransactionManager(context).beginTransaction();
    }
    commit(context: object): void {
        this.getTransactionManager(context).commit(this.store);
    }
    rollback(context: object): void {
        this.getTransactionManager(context).rollback();
    }
    put(context: object, key: string, value: string): void {
        const manager = this.getTransactionManager(context);
        const activeTransaction = manager.getActiveTransaction();
        if (activeTransaction) {
            activeTransaction.put(key, value);
        } else {
            this.store.set(key, value);
        }
    }
    get(context: object, key: string): string | undefined {
        const manager = this.getTransactionManager(context);
        const activeTransaction = manager.getActiveTransaction();
        if (activeTransaction) {
            return activeTransaction.get(key);
        }
        return this.store.get(key);
    }
    delete(context: object, key: string): void {
        const manager = this.getTransactionManager(context);
        const activeTransaction = manager.getActiveTransaction();
        if (activeTransaction) {
            activeTransaction.delete(key);
        } else {
            this.store.delete(key);
        }
    }
}

// --- Example Usage ---
const kvStore = KeyValueStore.getInstance();
const userContext = {};
console.log("--- Starting Test Scenario ---");
// Scenario 1: Top-level transaction
console.log("\n--- Top-level transaction test ---");
kvStore.beginTransaction(userContext);
kvStore.put(userContext, "name", "Alice");
kvStore.put(userContext, "age", "30");
console.log("Before commit: name is " + kvStore.get(userContext, "name"));
kvStore.commit(userContext);
console.log("After commit: name is " + kvStore.get(userContext, "name"));
// Scenario 2: Nested transaction
console.log("\n--- Nested transaction test ---");
kvStore.beginTransaction(userContext); // Outer transaction
kvStore.put(userContext, "name", "Bob");
console.log("Outer transaction: name is " + kvStore.get(userContext, "name"));
kvStore.beginTransaction(userContext); // Nested transaction
kvStore.put(userContext, "city", "San Francisco");
kvStore.put(userContext, "name", "Charlie"); // Overrides 'Bob'
console.log("Inner transaction: name is " + kvStore.get(userContext, "name"));
kvStore.delete(userContext, "age");
console.log("Inner transaction: age is " + kvStore.get(userContext, "age"));
kvStore.commit(userContext); // Commit nested transaction
console.log("After inner commit (in outer trans.): name is " + kvStore.get(userContext, "name"));
console.log("After inner commit (in outer trans.): age is " + kvStore.get(userContext, "age"));
kvStore.rollback(userContext); // Rollback outer transaction
console.log("After outer rollback: name is " + kvStore.get(userContext, "name")); // Should be Alice
console.log("After outer rollback: city is " + kvStore.get(userContext, "city")); // Should be undefined

export {}