
class Ticket {
  
  public exitGate?: string;
  public cost?: number;
  public unparkedAt?: Date;

  constructor (
    public ticketId: string,
    public spotId: string,
    public entryGateId: string,
    public parkedAt: Date,
    public vehicleId: string
  ) {}

  
}

export { Ticket };
