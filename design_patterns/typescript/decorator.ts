// Base Beverage interface
interface Beverage {
    cost(): number;
    description(): string;
}

// Concrete beverages
class Espresso implements Beverage {
    cost(): number {
        return 10;
    }

    description(): string {
        return "Espresso";
    }
}

class Latte implements Beverage {
    cost(): number {
        return 20;
    }

    description(): string {
        return "Latte";
    }
}

// Abstract decorator class
abstract class AddonDecorator implements Beverage {
    protected beverage: Beverage;

    constructor(beverage: Beverage) {
        this.beverage = beverage;
    }

    abstract cost(): number;
    abstract description(): string;
}

// Concrete decorators
class Caramel extends AddonDecorator {
    cost(): number {
        return this.beverage.cost() + 1;
    }

    description(): string {
        return this.beverage.description() + " with Caramel";
    }
}

class Choco extends AddonDecorator {
    cost(): number {
        return this.beverage.cost() + 2;
    }

    description(): string {
        return this.beverage.description() + " with Chocolate";
    }
}

// Main function
function main(): void {
    // Create a Latte with Chocolate
    const beverage: Beverage = new Choco(new Latte());
    console.log(`${beverage.description()}: $${beverage.cost()}`);

    // Create an Espresso with Caramel and Chocolate
    const complexBeverage: Beverage = new Choco(new Caramel(new Espresso()));
    console.log(`${complexBeverage.description()}: $${complexBeverage.cost()}`);
}

// Execute main
main();