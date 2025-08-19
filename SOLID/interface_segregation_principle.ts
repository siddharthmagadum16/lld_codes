/*
The ISP states that clients should not be forced to depend on interfaces they do not use. 
It suggests breaking down large, monolithic interfaces into smaller, more specific ones. 
This prevents a class from having to implement methods it doesn't need, leading to a more streamlined 
and flexible design.
*/

/* ------ Not Following Principle ------ */
// A fat interface that includes methods for both humans and robots.
interface Workerr {
    work(): void;
    eat(): void;
}

class Human implements Workerr {
    work() {
        console.log("Human is working.");
    }

    eat() {
        console.log("Human is eating.");
    }
}

class Robot implements Workerr {
    work() {
        console.log("Robot is working.");
    }

    // The robot has to implement this method, even though it doesn't eat.
    eat() {
        // Does nothing or throws an error, which is a design smell.
        console.log("Robot does not eat.");
    }
}

// Usage
const humanWorkerr: Workerr = new Human();
const robotWorkerr: Workerr = new Robot();

humanWorkerr.work();
humanWorkerr.eat();

robotWorkerr.work();
robotWorkerr.eat(); // This call is meaningless for the robot.


/* ------ Following Principle ------ */


// A smaller, more specific interface for things that can work.
interface Workable {
    work(): void;
}

// A separate interface for things that can eat.
interface Eatable {
    eat(): void;
}

// The Human class can do both, so it implements both interfaces.
class Human2 implements Workable, Eatable {
    work() {
        console.log("Human is working.");
    }

    eat() {
        console.log("Human is eating.");
    }
}

// The Robot class only works, so it only implements the Workable interface.
class Robot2 implements Workable {
    work() {
        console.log("Robot is working.");
    }
}

// A function that only needs the ability to work.
function startWork(worker: Workable) {
    worker.work();
}

// A function that only needs the ability to eat.
function startEating(eater: Eatable) {
    eater.eat();
}

// Usage
const humanWorker = new Human2();
const robotWorker = new Robot2();

startWork(humanWorker);
startEating(humanWorker);

startWork(robotWorker);
// This would be a compile-time error, as the Robot does not implement Eatable.
// startEating(robotWorker);
