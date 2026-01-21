import { Movie } from "./Movie";
import { Screen, Seat } from "./Theatre";

export enum ShowSeatStatus {
    AVAILABLE = 'AVAILABLE',
    LOCKED = 'LOCKED',
    BOOKED = 'BOOKED'
}

export class ShowSeat {
    constructor(
        public readonly seatId: string,
        public status: ShowSeatStatus,
        public price: number
    ) { }
}

export class Show {
    public readonly showSeats: Map<string, ShowSeat>;

    constructor(
        public readonly id: string,
        public readonly movie: Movie,
        public readonly screen: Screen,
        public readonly startTime: Date,
        public readonly endTime: Date // derived based on movie duration usually
    ) {
        this.showSeats = new Map();
        // Initialize show seats based on screen seats
        this.screen.seats.forEach(seat => {
            this.showSeats.set(seat.id, new ShowSeat(seat.id, ShowSeatStatus.AVAILABLE, seat.price));
        });
    }

    public getAvailableSeats(): ShowSeat[] {
        return Array.from(this.showSeats.values()).filter(s => s.status === ShowSeatStatus.AVAILABLE);
    }
}
