// Shape interface
interface Shape {
    draw(): void;
}

// Circle class implementing Shape interface
class Circle implements Shape {
    draw(): void {
        console.log("Drawing a Circle");
    }
}

// Square class implementing Shape interface
class Square implements Shape {
    draw(): void {
        console.log("Drawing a Square");
    }
}

// ShapeFactory class to create shapes
class ShapeFactory {
    // Registry of shape types and their constructors
    private static readonly shapeMap = new Map<string, new () => Shape>();

    /**
     * Register a new shape type (allows extension without modification - OCP compliant)
     */
    static register(shapeType: string, shapeClass: new () => Shape): void {
        this.shapeMap.set(shapeType, shapeClass);
    }

    /**
     * Factory method to create shapes using a Map registry.
     */
    static createShape(shapeType: string): Shape | null {
        const ShapeClass = this.shapeMap.get(shapeType);
        return ShapeClass ? new ShapeClass() : null;
    }
}

// Register shapes (can be done from anywhere without modifying ShapeFactory)
ShapeFactory.register("Circle", Circle);
ShapeFactory.register("Square", Square);

// Main function
function main(): void {
    // Create a Circle using the factory
    const shape1 = ShapeFactory.createShape("Circle");
    if (shape1) shape1.draw(); // Output: Drawing a Circle

    // Create a Square using the factory
    const shape2 = ShapeFactory.createShape("Square");
    if (shape2) shape2.draw(); // Output: Drawing a Square
}

// Execute main
main();