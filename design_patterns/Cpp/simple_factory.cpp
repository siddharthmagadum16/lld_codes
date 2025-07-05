#include <iostream>
using namespace std;



// Shape interface
class Shape {
public:
    virtual void draw() = 0; // Pure virtual function
    virtual ~Shape() {} // Virtual destructor
};


// Circle class implementing Shape interface
class Circle : public Shape {
public:
    void draw() override {
        cout << "Drawing a Circle" << endl;
    }
};

// Square class implementing Shape interface
class Square : public Shape {
public:
    void draw() override {
        cout << "Drawing a Square" << endl;
    }
};

// ShapeFactory class to create shapes
class ShapeFactory {
public:
    // Factory method to create shapes
    static Shape* createShape(const string& shapeType) {
        if (shapeType == "Circle") {
            return new Circle();
        } else if (shapeType == "Square") {
            return new Square();
        }
        return nullptr; // Return null if shape type is unknown
    }
};

int main() {
    // Create a Circle using the factory
    Shape* shape1 = ShapeFactory::createShape("Circle");
    shape1->draw(); // Output: Drawing a Circle

    // Create a Square using the factory
    Shape* shape2 = ShapeFactory::createShape("Square");
    shape2->draw(); // Output: Drawing a Square

    // Clean up memory
    delete shape1;
    delete shape2;

    return 0;
}
