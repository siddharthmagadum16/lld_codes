import { Booking, BookingStatus } from "../entities/Booking";
import { Show, ShowSeat, ShowSeatStatus } from "../entities/Show";
import { PaymentService } from "./PaymentService";
import { SeatLockService } from "./SeatLockService";

export class BookingService {
    private bookings: Map<string, Booking> = new Map();
    private seatLockService: SeatLockService;
    private paymentService: PaymentService;

    constructor(seatLockService: SeatLockService, paymentService: PaymentService) {
        this.seatLockService = seatLockService;
        this.paymentService = paymentService;
    }

    public createBooking(userEmail: string, show: Show, selectedSeatIds: string[]): Booking {
        // 1. Identify ShowSeat objects
        const seatsToBook: ShowSeat[] = [];
        for (const seatId of selectedSeatIds) {
            const seat = show.showSeats.get(seatId);
            if (seat) {
                seatsToBook.push(seat);
            }
        }

        if (seatsToBook.length !== selectedSeatIds.length) {
            throw new Error("Invalid seat IDs provided");
        }

        // 2. Try to lock seats
        const areLocked = this.seatLockService.lockSeats(show, seatsToBook, userEmail);

        if (!areLocked) {
            throw new Error("Could not lock selected seats. They might be already booked or locked.");
        }

        // 3. Create Booking
        const bookingId = `BKG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const totalAmount = seatsToBook.reduce((sum, seat) => sum + seat.price, 0);

        const booking = new Booking(
            bookingId,
            show,
            seatsToBook,
            userEmail,
            BookingStatus.PENDING,
            totalAmount,
            new Date()
        );

        this.bookings.set(bookingId, booking);
        return booking;
    }

    public confirmBooking(bookingId: string, userEmail: string): Booking {
        const booking = this.bookings.get(bookingId);
        if (!booking) {
            throw new Error("Booking not found");
        }
        if (booking.userEmail !== userEmail) {
            throw new Error("User mismatch");
        }
        if (booking.status !== BookingStatus.PENDING) {
            throw new Error(`Booking is in ${booking.status} state, cannot confirm.`);
        }

        // 4. Validate locks again just in case (optional if PENDING implies we hold lock, but safe)
        // Check if any seat lock is lost
        for (const seat of booking.seats) {
            if (!this.seatLockService.validateLock(booking.show, seat, userEmail)) {
                booking.status = BookingStatus.EXPIRED;
                throw new Error("Lock expired during processing");
            }
        }

        // 5. Build Payment
        // Assuming instantaneous payment success for simulation
        const isPaid = this.paymentService.processPayment(booking);

        if (!isPaid) {
            booking.status = BookingStatus.FAILED;
            this.seatLockService.unlockSeats(booking.show, booking.seats, userEmail);
            throw new Error("Payment failed");
        }

        // 6. Success: Mark seats as BOOKED, modify booking status
        booking.status = BookingStatus.CONFIRMED;
        for (const seat of booking.seats) {
            seat.status = ShowSeatStatus.BOOKED;
        }
        // Remove locks as they are now booked
        this.seatLockService.unlockSeats(booking.show, booking.seats, userEmail); // Logic in unlock only unlocks if locked. Wait, unlock sets status to AVAILABLE.
        // FIX: unlockSeats logic sets status to AVAILABLE. We shouldn't use it here directly if we want them BOOKED.
        // We should just remove the lock entry from SeatLockService without modifying the seat status to AVAILABLE.
        // OR better, SeatLockService should have a `commitLocks` method.
        // For now, I'll just manually modify status back to BOOKED after unlocking, or update SeatLockService.

        // Let's modify SeatLockService to have `releaseLocks` which just deletes locks without changing status? 
        // Actually, `unlockSeats` logic: `seat.status = ShowSeatStatus.AVAILABLE;` is problematic for confirmation.
        // I will manually set them to BOOKED after calling unlock? No, unlock sets it to AVAILABLE.
        // I should probably remove locks directly or access `seatLockService` internals?
        // Let's assume for this design `seatLockService.unlockSeats` is for cancellation/timeout.
        // I will implement a `finalizeBooking` on seatLockService?
        // Or just let locks expire? No, that blocks others validation? 
        // A lock just prevents others. If status is BOOKED, others check `seat.status !== AVAILABLE` first so they fail.
        // valid check: `if (seat.status !== ShowSeatStatus.AVAILABLE) return false;` in lockSeats.
        // So if I change status to BOOKED, lock doesn't matter as much, but we should clean up memory.

        // So:
        // 1. Change status to BOOKED.
        // 2. Remove locks (so map doesn't grow).
        // If I call unlockSeats, it sets them to AVAILABLE. Bad.
        // I will rely on the fact that I control the code. I'll just let the locks expire in memory or add a cleanup method.
        // Let's add `confirmLocks(show, seats, user)` to SeatLockService. 
        // Since I can't edit SeatLockService easily in this turn without valid reasons (I can, but batching).
        // I'll just accept that I need to re-set status to BOOKED after unlocking.

        this.seatLockService.unlockSeats(booking.show, booking.seats, userEmail); // Sets to AVAILABLE
        booking.seats.forEach(s => s.status = ShowSeatStatus.BOOKED); // Corrects to BOOKED

        return booking;
    }
}
