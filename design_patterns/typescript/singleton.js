class Database {
    constructor() {
        if (Database.instance) return Database.instance;
        this.connection = "Connected to DB";
        Database.instance = this;
    }
}

const instance = new Database();

Object.freeze(instance); // Prevent modifications

console.log('helsfsd');
export default instance;