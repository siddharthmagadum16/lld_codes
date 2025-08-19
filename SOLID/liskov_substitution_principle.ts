/*
This principle, named after Barbara Liskov, states that objects of a 
superclass should be replaceable with objects of its subclasses without 
affecting the correctness of the program. In simpler terms, a subclass should 
behave in a way that is consistent with its parent class's behavior.
*/

/* ------ Not Following Principle ------ */
class Bird {
    fly() {
        console.log("The bird is flying.");
    }
}

class Penguin extends Bird {
    fly() {
        throw new Error("Penguins can't fly!");
    }
}

function makeBirdFly(bird: Bird) {
    bird.fly();
}

// This will work fine
makeBirdFly(new Bird());

// This will throw an error, violating LSP
try {
    makeBirdFly(new Penguin());
} catch (e: any) {
    console.log(e.message);
}


/* ------ Following Principle ------ */

// Base class, representing all birds
class Bird2 {
    // Shared bird properties/methods can go here
}

// A more specific base class for birds that can fly
class FlyingBird extends Bird2 {
    fly() {
        console.log("The flying bird is soaring through the sky.");
    }
}

// A more specific base class for birds that cannot fly
class FlightlessBird extends Bird2 {
    // No fly() method here, preventing misuse
}

// Concrete classes
class Sparrow extends FlyingBird {}

class Penguin2 extends FlightlessBird {}

// This function now correctly operates only on flying birds
function makeBirdFly2(bird: FlyingBird) {
    bird.fly();
}

// This works as expected
makeBirdFly2(new Sparrow());

// This will correctly cause a TypeScript compilation error
// makeBirdFly(new Penguin());