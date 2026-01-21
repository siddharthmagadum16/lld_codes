export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export class Payment {
    constructor(
        public readonly id: string,
        public readonly bookingId: string,
        public readonly amount: number,
        public status: PaymentStatus,
        public readonly createdAt: Date
    ) { }
}
