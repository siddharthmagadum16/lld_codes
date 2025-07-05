// Abstract Product: Sofa
abstract class Sofa {
    abstract sitOn(): void;
}

// Abstract Product: Chair
abstract class Chair {
    abstract sitOn(): void;
}

// Abstract Product: Table
abstract class Table {
    abstract place(): void;
}

// Concrete Products: Modern Furniture Items
class ModernSofa extends Sofa {
    sitOn(): void {
        console.log("Sitting on a Modern Sofa");
    }
}

class ModernChair extends Chair {
    sitOn(): void {
        console.log("Sitting on a Modern Chair");
    }
}

class ModernTable extends Table {
    place(): void {
        console.log("Placing items on a Modern Table");
    }
}

// Concrete Products: Traditional Furniture Items
class TraditionalSofa extends Sofa {
    sitOn(): void {
        console.log("Sitting on a Traditional Sofa");
    }
}

class TraditionalChair extends Chair {
    sitOn(): void {
        console.log("Sitting on a Traditional Chair");
    }
}

class TraditionalTable extends Table {
    place(): void {
        console.log("Placing items on a Traditional Table");
    }
}

// Abstract Factory: Furniture Factory
abstract class FurnitureFactory {
    abstract createSofa(): Sofa;
    abstract createChair(): Chair;
    abstract createTable(): Table;

    static CreateFurnitureFactory(type: string): FurnitureFactory | null {
        if (type === "modern") {
            return new ModernFurnitureFactory();
        }
        else if (type === "traditional") {
            return new TraditionalFurnitureFactory();
        }
        else return null;
    }
}

// Concrete Factory: Modern Furniture Factory
class ModernFurnitureFactory extends FurnitureFactory {
    createSofa(): Sofa {
        return new ModernSofa();
    }

    createChair(): Chair {
        return new ModernChair();
    }

    createTable(): Table {
        return new ModernTable();
    }
}

// Concrete Factory: Traditional Furniture Factory
class TraditionalFurnitureFactory extends FurnitureFactory {
    createSofa(): Sofa {
        return new TraditionalSofa();
    }

    createChair(): Chair {
        return new TraditionalChair();
    }

    createTable(): Table {
        return new TraditionalTable();
    }
}

// Main function
function main(): void {
    // Create a Modern Furniture Factory
    const modernFactory = FurnitureFactory.CreateFurnitureFactory("modern");

    if (modernFactory) {
        // Create Modern furniture items
        const modernSofa = modernFactory.createSofa();
        const modernChair = modernFactory.createChair();
        const modernTable = modernFactory.createTable();

        // Use Modern furniture items
        modernSofa.sitOn();
        modernChair.sitOn();
        modernTable.place();
    }

    // Create a Traditional Furniture Factory
    const traditionalFactory = FurnitureFactory.CreateFurnitureFactory("traditional");

    if (traditionalFactory) {
        // Create Traditional furniture items
        const traditionalSofa = traditionalFactory.createSofa();
        const traditionalChair = traditionalFactory.createChair();
        const traditionalTable = traditionalFactory.createTable();

        // Use Traditional furniture items
        traditionalSofa.sitOn();
        traditionalChair.sitOn();
        traditionalTable.place();
    }
}

// Execute main
main();