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
    // Factory method to create shapes
    static createShape(shapeType: string): Shape | null {
        if (shapeType === "Circle") {
            return new Circle();
        } else if (shapeType === "Square") {
            return new Square();
        }
        return null; // Return null if shape type is unknown
    }
}

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