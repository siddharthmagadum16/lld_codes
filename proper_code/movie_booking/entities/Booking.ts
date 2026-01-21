import { Show, ShowSeat } from "./Show";

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    FAILED = 'FAILED',
    EXPIRED = 'EXPIRED'
}



export class Booking {
    constructor(
        public readonly id: string,
        public readonly show: Show,
        public readonly seats: ShowSeat[],
        public readonly userEmail: string,
        public status: BookingStatus,
        public amount: number,
        public readonly createdAt: Date
    ) { }
}
