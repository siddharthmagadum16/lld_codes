import { Movie } from "../entities/Movie";
import { Show } from "../entities/Show";
import { Theatre } from "../entities/Theatre";

export class MovieSearchService {
    private theatres: Theatre[] = [];
    private shows: Show[] = [];

    constructor(theatres: Theatre[], shows: Show[]) {
        this.theatres = theatres;
        this.shows = shows;
    }

    public getMoviesByCity(city: string): Movie[] {
        const theatresInCity = this.theatres.filter(t => t.city.toLowerCase() === city.toLowerCase());
        const theatreIds = theatresInCity.map(t => t.id);

        const showsInCity = this.shows.filter(s => theatreIds.includes(s.screen.id)); // Bug: s.screen.id might not match theatre id directly, screen belongs to theatre.
        // Screen belongs to theatre. Theatre has list of screens.
        // We need to check if the show's screen belongs to one of the theatres in the city.

        // Better logic:
        const availableMovies = new Map<string, Movie>();

        for (const show of this.shows) {
            // Find theatre for this show's screen
            const theatre = this.theatres.find(t => t.screens.some(sc => sc.id === show.screen.id));
            if (theatre && theatre.city.toLowerCase() === city.toLowerCase()) {
                availableMovies.set(show.movie.id, show.movie);
            }
        }

        return Array.from(availableMovies.values());
    }

    public getTheatresForMovie(movieName: string, city: string): Theatre[] {
        // Return theatres in city playing this movie
        const matchingTheatres = new Set<Theatre>();
        for (const show of this.shows) {
            if (show.movie.title.toLowerCase() === movieName.toLowerCase()) {
                const theatre = this.theatres.find(t => t.screens.some(sc => sc.id === show.screen.id));
                if (theatre && theatre.city.toLowerCase() === city.toLowerCase()) {
                    matchingTheatres.add(theatre);
                }
            }
        }
        return Array.from(matchingTheatres);
    }

    public getShowsForTheatre(theatreId: string, movieTitle: string, date: Date): Show[] {
        return this.shows.filter(s => {
            const isTheatreMatch = this.theatres.find(t => t.id === theatreId && t.screens.some(sc => sc.id === s.screen.id));
            const isMovieMatch = s.movie.title.toLowerCase() === movieTitle.toLowerCase();
            const isDateMatch = s.startTime.getDate() === date.getDate() &&
                s.startTime.getMonth() === date.getMonth() &&
                s.startTime.getFullYear() === date.getFullYear();

            return isTheatreMatch && isMovieMatch && isDateMatch;
        });
    }
}
