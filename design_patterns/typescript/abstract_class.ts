// Abstract class Animal with common and abstract methods
abstract class Animal {
    protected animalType: string;

    constructor(animalType: string) {
        this.animalType = animalType;
    }

    // Common implemented method
    runs(): void {
        console.log(`The ${this.animalType} runs`);
    }

    // Abstract method that must be implemented by child classes
    abstract makesSound(): void;
}

// Dog class inheriting from Animal
class Dog extends Animal {
    constructor() {
        super("Dog");
    }

    // Implementation of the abstract method
    makesSound(): void {
        console.log("Woof! Woof!");
    }
}

// Cat class inheriting from Animal
class Cat extends Animal {
    constructor() {
        super("Cat");
    }

    // Implementation of the abstract method
    makesSound(): void {
        console.log("Meow! Meow!");
    }
}

// Example usage
function demonstrateAnimals() {
    console.log("=== Animal Abstract Class Demo ===\n");

    // Create instances of child classes
    const dog = new Dog();
    const cat = new Cat();

    // Test the common method
    console.log("Testing runs() method:");
    dog.runs(); // Output: The Dog runs
    cat.runs(); // Output: The Cat runs

    console.log("\nTesting makesSound() method:");
    dog.makesSound(); // Output: Woof! Woof!
    cat.makesSound(); // Output: Meow! Meow!

    // Demonstrate that abstract class cannot be instantiated
    console.log("\nTrying to instantiate abstract class (this would cause an error):");
    console.log("// const animal = new Animal('Generic'); // This would cause compilation error");

    // Uncomment the line below to see the error:
    // const animal = new Animal('Generic'); // Error: Cannot create an instance of an abstract class
}

// Run the demonstration
demonstrateAnimals();

export { Animal, Dog, Cat };
