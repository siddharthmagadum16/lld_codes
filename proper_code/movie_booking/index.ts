/* NOTE: This is AI generated LLD */

import { Movie } from "./entities/Movie";
import { Screen, Seat, SeatType, Theatre } from "./entities/Theatre";
import { Show, ShowSeatStatus } from "./entities/Show";
import { SeatLockService } from "./services/SeatLockService";
import { MovieSearchService } from "./services/MovieSearchService";
import { BookingService } from "./services/BookingService";
import { PaymentService } from "./services/PaymentService";

// 1. Setup Data
console.log("Setting up data...");

// Movies
const movie1 = new Movie("M1", "Inception", "Dream heist", 148, "English", "Sci-Fi");
const movie2 = new Movie("M2", "Interstellar", "Space travel", 169, "English", "Sci-Fi");

// Seats (10 seats)
const seats: Seat[] = [];
for (let i = 1; i <= 10; i++) {
    seats.push(new Seat(`S${i}`, "A", i, SeatType.GOLD, 200));
}

// Screen
const screen1 = new Screen("SC1", "Screen 1", seats);

// Theatre
const theatre1 = new Theatre("T1", "PVR Koramangala", "Bangalore", [screen1]);

// Shows
const today = new Date();
const show1 = new Show("SH1", movie1, screen1, new Date(today.setHours(18, 0, 0, 0)), new Date(today.setHours(21, 0, 0, 0)));
const show2 = new Show("SH2", movie2, screen1, new Date(today.setHours(14, 0, 0, 0)), new Date(today.setHours(17, 0, 0, 0)));

const theatres = [theatre1];
const shows = [show1, show2];

// Services
const seatLockService = SeatLockService.getInstance();
const movieSearchService = new MovieSearchService(theatres, shows);
const paymentService = new PaymentService();
const bookingService = new BookingService(seatLockService, paymentService);

async function runSimulation() {
    try {
        console.log("\n--- Simulation Start ---");

        // 1. User A searches for movies in Bangalore
        console.log("\n1. Searching for movies in Bangalore:");
        const moviesInBangalore = movieSearchService.getMoviesByCity("Bangalore");
        console.log("Found:", moviesInBangalore.map(m => m.title).join(", "));

        // 2. Get Shows for Inception
        console.log("\n2. Getting shows for 'Inception':");
        const inceptionShows = movieSearchService.getShowsForTheatre(theatre1.id, "Inception", today);
        console.log("Found Shows:", inceptionShows.map(s => s.id));

        const targetShow = inceptionShows[0];
        if (!targetShow) {
            console.error("No show found!");
            return;
        }

        // 3. User A selects seats (Locking)
        const userA = "userA@example.com";
        const userA_Seats = ["S1", "S2"];
        console.log(`\n3. User A (${userA}) attempting to select seats: ${userA_Seats.join(", ")}`);

        const bookingA = bookingService.createBooking(userA, targetShow, userA_Seats);
        console.log("User A Booking Created (Pending):", bookingA.id);
        console.log("Seat Status after Lock:");
        userA_Seats.forEach(sid => {
            console.log(`Seat ${sid}: ${targetShow.showSeats.get(sid)?.status}`);
        });

        // 4. User B attempts to select same seats (Concurrency Test)
        const userB = "userB@example.com";
        const userB_Seats = ["S2", "S3"]; // S2 is overlapping
        console.log(`\n4. User B (${userB}) attempting to select seats: ${userB_Seats.join(", ")} (Overlap S2)`);

        try {
            bookingService.createBooking(userB, targetShow, userB_Seats);
        } catch (e: any) {
            console.log("User B Booking Failed as expected:", e.message);
        }

        // 5. User A confirms booking
        console.log(`\n5. User A confirming booking: ${bookingA.id}`);
        const bookingConfirmed = bookingService.confirmBooking(bookingA.id, userA);

        console.log("Booking Confirmed:", bookingConfirmed.id);
        console.log("Seats confirmed:", bookingConfirmed.seats.map(s => s.seatId));

        console.log("Seat Status after Booking:");
        userA_Seats.forEach(sid => {
            console.log(`Seat ${sid}: ${targetShow.showSeats.get(sid)?.status}`);
        });

        // 6. User B tries again for S2 (Should still fail as it is BOOKED)
        console.log(`\n6. User B trying S2 again after booking:`);
        try {
            bookingService.createBooking(userB, targetShow, ["S2"]);
        } catch (e: any) {
            console.log("User B Booking Failed as expected:", e.message);
        }

        // 7. User B tries non-overlapping S3 (Should succeed)
        console.log(`\n7. User B trying S3 (Available):`);
        const bookingB = bookingService.createBooking(userB, targetShow, ["S3"]);
        console.log("User B Booking Created:", bookingB.id);

    } catch (error) {
        console.error("Simulation Error:", error);
    }
}

runSimulation();
