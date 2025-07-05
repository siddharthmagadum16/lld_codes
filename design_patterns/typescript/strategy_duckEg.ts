// Quack Behavior Interface
interface IQuackBehaviour {
    quack(): void;
}

class SimpleQuack implements IQuackBehaviour {
    quack(): void {
        console.log("Simple Quack");
    }
}

class DeepQuack implements IQuackBehaviour {
    quack(): void {
        console.log("Deep Quack");
    }
}

// Fly Behavior Interface
interface IFlyBehaviour {
    fly(): void;
}

class LowFly implements IFlyBehaviour {
    fly(): void {
        console.log("Low fly");
    }
}

class HighFly implements IFlyBehaviour {
    fly(): void {
        console.log("High fly");
    }
}

// Duck class using strategy pattern
class Duck {
    private quackStrategy: IQuackBehaviour;
    private flyStrategy: IFlyBehaviour;

    constructor(quack: string, fly: string) {
        // Initialize quack strategy
        if (quack === "simple") {
            this.quackStrategy = new SimpleQuack();
        } else if (quack === "deep") {
            this.quackStrategy = new DeepQuack();
        } else {
            throw new Error("Unknown quack strategy");
        }

        // Initialize fly strategy
        if (fly === "low") {
            this.flyStrategy = new LowFly();
        } else if (fly === "high") {
            this.flyStrategy = new HighFly();
        } else {
            throw new Error("Unknown fly strategy");
        }
    }

    quack(): void {
        this.quackStrategy.quack();
    }

    fly(): void {
        this.flyStrategy.fly();
    }
}

// Main function
function main(): void {
    const duck = new Duck("simple", "high");
    duck.quack();
    duck.fly();
}

// Execute main
main();