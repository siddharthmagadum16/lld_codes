import { Booking } from "../entities/Booking";

export class PaymentService {
    public processPayment(booking: Booking): boolean {
        console.log(`Processing payment of ${booking.amount} for booking ${booking.id}...`);
        // Simulate success
        return true;
    }
}
