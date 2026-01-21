import { Show, ShowSeat, ShowSeatStatus } from "../entities/Show";

interface Lock {
    userId: string;
    lockTime: Date;
    expiryTime: Date;
}

export class SeatLockService {
    private static instance: SeatLockService;
    // Map of "showId_seatId" -> Lock
    private locks: Map<string, Lock> = new Map();
    private readonly LOCK_TIMEOUT_MS = 10000; // 10 seconds lock for testing

    private constructor() { }

    public static getInstance(): SeatLockService {
        if (!SeatLockService.instance) {
            SeatLockService.instance = new SeatLockService();
        }
        return SeatLockService.instance;
    }

    public lockSeats(show: Show, seats: ShowSeat[], userId: string): boolean {
        // Critical Section: In a distributed system, this would use Redis/DB lock.
        // Here, Node.js is single-threaded, so this block is atomic relative to event loop
        // provided no booking spans across async await in the check-then-act phase.

        // 1. Verify all seats are available AND not locked by others
        for (const seat of seats) {
            if (seat.status !== ShowSeatStatus.AVAILABLE) {
                return false;
            }
            const lockKey = this.getLockKey(show.id, seat.seatId);
            if (this.locks.has(lockKey)) {
                const lock = this.locks.get(lockKey)!;
                if (lock.expiryTime > new Date()) {
                    // Lock is still valid and held by someone else (or same user, but we treat re-lock as fail for simplicity or allow? Let's assume strict availability)
                    return false;
                } else {
                    // Expired lock, remove it
                    this.locks.delete(lockKey);
                }
            }
        }

        // 2. Acquire locks
        const now = new Date();
        const expiry = new Date(now.getTime() + this.LOCK_TIMEOUT_MS);

        for (const seat of seats) {
            const lockKey = this.getLockKey(show.id, seat.seatId);
            this.locks.set(lockKey, {
                userId: userId,
                lockTime: now,
                expiryTime: expiry
            });
            // Set transient status on the seat object itself for visibility, though source of truth is the lock service + booking status
            seat.status = ShowSeatStatus.LOCKED;
        }

        return true;
    }

    public unlockSeats(show: Show, seats: ShowSeat[], userId: string): void {
        for (const seat of seats) {
            const lockKey = this.getLockKey(show.id, seat.seatId);
            if (this.locks.has(lockKey)) {
                const lock = this.locks.get(lockKey)!;
                if (lock.userId === userId) {
                    this.locks.delete(lockKey);
                    seat.status = ShowSeatStatus.AVAILABLE;
                }
            }
        }
    }

    public validateLock(show: Show, seat: ShowSeat, userId: string): boolean {
        const lockKey = this.getLockKey(show.id, seat.seatId);
        if (!this.locks.has(lockKey)) return false;
        const lock = this.locks.get(lockKey)!;
        return lock.userId === userId && lock.expiryTime > new Date();
    }

    private getLockKey(showId: string, seatId: string): string {
        return `${showId}_${seatId}`;
    }
}
