/* https://p.ip.fi/iYhp
use case: whenever there is a data change happening and many multiple tasks should be carried out.

in other way - when a publisher publishes an event, all subscribers for a topic consume it

UML diagram - https://imgur.com/a/0eoz9aT

checkout this YT short too - https://youtube.com/shorts/K1HHbKJvcv8?si=3S2rBVvjbFxzT1dK (no need of below interface)

to extend this further as a followup, there can be push or pull type of Subject(observerable)

Here Group class is Subject (observable), and Person is observer
*/

// Observer interface
interface ISubscriber {
    notify(message: string): void;
    getName(): string;
}
interface Person {
    getName(): string;
}

//Key principle: TypeScript only cares if the object has at least what's required by the interface. Extra properties/methods are fine
// Concrete Observer
class Employee implements Person, ISubscriber {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    notify(message: string): void {
        console.log(`${this.name} is notified about: ${message}`);
    }

    getName(): string {
        return this.name;
    }
}

// Subject (Observable)
class Group {
    private subscribers: Set<ISubscriber> = new Set();

    addSubscriber(subscriber: ISubscriber): void {
        this.subscribers.add(subscriber);
        console.log(`${subscriber.getName()} subscribed to the group`);
    }

    removeSubscriber(subscriber: ISubscriber): void {
        if (this.subscribers.delete(subscriber)) {
            console.log(`${subscriber.getName()} unsubscribed from the group`);
        }
    }

    notify(message: string): void {
        console.log(`\nBroadcasting: "${message}"`);
        this.subscribers.forEach(subscriber => {
            subscriber.notify(message);
        });
    }
}

// Main function
function main(): void {
    const group = new Group();

    // Create users
    const user1 = new Employee("sid");
    const user2 = new Employee("mom");
    const user3 = new Employee("sonu");

    // Subscribe users to group
    group.addSubscriber(user1);
    group.addSubscriber(user2);
    group.addSubscriber(user3);

    // Send first notification
    group.notify("message1");

    // Remove user3
    group.removeSubscriber(user3);

    // Send second notification
    group.notify("message2");
}

// Execute main
main();