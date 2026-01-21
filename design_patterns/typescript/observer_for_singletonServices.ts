

interface ISub {
    notify(message: string): void;
}
// make booking service and payment processor singleton in interview
class BookingService implements ISub {

    notify(message: string): void {
        console.log(message);
    }
}

interface IPub {
    subscribe(sub: ISub): void;
    unsubscribe(sub: ISub): void;
    notify(message: string): void;
}

class PaymentProcessor implements IPub {
    private static observers: Set<ISub> = new Set();

    subscribe(sub: ISub) {
        PaymentProcessor.observers.add(sub);
    }
    unsubscribe(sub: ISub) {
        PaymentProcessor.observers.delete(sub);
    }
    notify  = (message: string) => {
        PaymentProcessor.observers.forEach(sub => sub.notify(message))
    }
}

const paymentProcessor = new PaymentProcessor();
const bookingservice = new BookingService();
paymentProcessor.subscribe(bookingservice);
paymentProcessor.notify('message1');
paymentProcessor.unsubscribe(bookingservice);
paymentProcessor.notify('message2');
