export class Movie {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly description: string,
        public readonly durationInMinutes: number,
        public readonly language: string,
        public readonly genre: string
    ) { }
}
