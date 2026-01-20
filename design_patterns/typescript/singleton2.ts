class Database {
    private static instance: Database;
    public connection!: string;

    constructor() {
        if (Database.instance) return Database.instance;
        this.connection = "Connected to DB";
        Database.instance = this;
    }
}

const instance = new Database();

Object.freeze(instance); // Prevent modifications

export default instance;