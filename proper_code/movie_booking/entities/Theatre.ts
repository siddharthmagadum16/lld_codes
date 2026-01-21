export enum SeatType {
    SIVER = 'SILVER',
    GOLD = 'GOLD',
    PLATINUM = 'PLATINUM'
}

export class Seat {
    constructor(
        public readonly id: string,
        public readonly row: string,
        public readonly number: number,
        public readonly type: SeatType,
        public readonly price: number
    ) { }
}

export class Screen {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly seats: Seat[]
    ) { }
}

export class Theatre {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly city: string,
        public readonly screens: Screen[]
    ) { }
}
