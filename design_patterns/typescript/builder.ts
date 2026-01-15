class Desktop {
    constructor(
        public motherboard: string = "",
        public processor: string = "",
        public memory: string = "",
        public storage: string = ""
    ) {}

    display() { console.log(this); }
}

class DesktopBuilder {
    private desktop = new Desktop();

    setMotherboard(mb: string): this {
        this.desktop.motherboard = mb;
        return this; // Allows chaining
    }

    setProcessor(p: string): this {
        this.desktop.processor = p;
        return this;
    }

    setMemory(m: string): this {
        this.desktop.memory = m;
        return this;
    }

    setStorage(s: string): this {
        this.desktop.storage = s;
        return this;
    }

    build(): Desktop {
        const result = this.desktop;
        this.desktop = new Desktop(); // Reset for next build
        return result;
    }
}

// Usage: Fluent and Flexible
const myDesktop = new DesktopBuilder()
    .setMotherboard("ASUS ROG")
    .setProcessor("i9")
    .setMemory("64GB")
    .build();

myDesktop.display();