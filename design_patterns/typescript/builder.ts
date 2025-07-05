// Desktop class representing the product to be built
class Desktop {
    motherboard: string = "";
    processor: string = "";
    memory: string = "";
    storage: string = "";
    graphicsCard: string = "";

    display(): void {
        console.log("Desktop Specs:");
        console.log(`Motherboard: ${this.motherboard}`);
        console.log(`Processor: ${this.processor}`);
        console.log(`Memory: ${this.memory}`);
        console.log(`Storage: ${this.storage}`);
        console.log(`Graphics Card: ${this.graphicsCard}`);
    }
}

// Abstract DesktopBuilder class
abstract class DesktopBuilder {
    protected desktop: Desktop = new Desktop();

    abstract buildMotherboard(): void;
    abstract buildProcessor(): void;
    abstract buildMemory(): void;
    abstract buildStorage(): void;
    abstract buildGraphicsCard(): void;

    getDesktop(): Desktop {
        return this.desktop;
    }

    // Reset builder for building a new desktop
    reset(): void {
        this.desktop = new Desktop();
    }
}

// Concrete Builder: DellDesktopBuilder
class DellDesktopBuilder extends DesktopBuilder {
    buildMotherboard(): void {
        this.desktop.motherboard = "Dell Motherboard";
    }

    buildProcessor(): void {
        this.desktop.processor = "Dell Processor";
    }

    buildMemory(): void {
        this.desktop.memory = "32GB DDR4 RAM";
    }

    buildStorage(): void {
        this.desktop.storage = "1TB SSD + 2TB HDD";
    }

    buildGraphicsCard(): void {
        this.desktop.graphicsCard = "NVIDIA RTX 3080";
    }
}

// Concrete Builder: HpDesktopBuilder
class HpDesktopBuilder extends DesktopBuilder {
    buildMotherboard(): void {
        this.desktop.motherboard = "HP Motherboard";
    }

    buildProcessor(): void {
        this.desktop.processor = "Intel Core i5";
    }

    buildMemory(): void {
        this.desktop.memory = "16GB DDR4 RAM";
    }

    buildStorage(): void {
        this.desktop.storage = "512GB SSD";
    }

    buildGraphicsCard(): void {
        this.desktop.graphicsCard = "Integrated Graphics";
    }
}

// Director class that orchestrates the building process
class DesktopDirector {
    buildDesktop(builder: DesktopBuilder): Desktop {
        builder.reset(); // Ensure we start with a fresh desktop
        builder.buildMotherboard();
        builder.buildProcessor();
        builder.buildMemory();
        builder.buildStorage();
        builder.buildGraphicsCard();
        return builder.getDesktop();
    }
}

// Main function
function main(): void {
    const director = new DesktopDirector();

    // Build Dell Desktop
    const dellDesktopBuilder = new DellDesktopBuilder();
    const dellDesktop = director.buildDesktop(dellDesktopBuilder);

    // Build HP Desktop
    const hpDesktopBuilder = new HpDesktopBuilder();
    const hpDesktop = director.buildDesktop(hpDesktopBuilder);

    // Display both desktops
    console.log("=== Dell Desktop ===");
    dellDesktop.display();

    console.log("\n=== HP Desktop ===");
    hpDesktop.display();
}

// Execute main
main();