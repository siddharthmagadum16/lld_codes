This directory consists of SOLID principles **with and without** application of each of the principles.

SOLID is an acronym for five key design principles in object-oriented programming that help create more maintainable, flexible, and scalable software.

***

### S: Single Responsibility Principle (SRP)
This principle states that a class should have only one reason to change, meaning it should have a single, well-defined job or responsibility. This makes the code easier to test, understand, and maintain. For example, a class for managing users should not also handle sending emails; a separate class should handle the email functionality.

***

### O: Open-Closed Principle (OCP)
The OCP states that software entities (classes, modules, etc.) should be **open for extension** but **closed for modification**. You should be able to add new functionality without changing existing, working code. This is often achieved through inheritance or interfaces, allowing you to extend behavior without altering the base code.

***

### L: Liskov Substitution Principle (LSP)
This principle, named after Barbara Liskov, states that objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program. In simpler terms, a subclass should behave in a way that is consistent with its parent class's behavior. 

***

### I: Interface Segregation Principle (ISP)
The ISP states that clients should not be forced to depend on interfaces they do not use. It suggests breaking down large, monolithic interfaces into smaller, more specific ones. This prevents a class from having to implement methods it doesn't need, leading to a more streamlined and flexible design.

***

### D: Dependency Inversion Principle (DIP)
The DIP states that high-level modules should not depend on low-level modules; both should depend on abstractions (like interfaces). Additionally, abstractions should not depend on details; details should depend on abstractions. This principle decouples components, making the system more modular and easier to test.