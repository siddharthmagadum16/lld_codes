import { Ticket } from "../entities/Ticket";


class TicketBuilderService {

  private _ticketId?: string;
  private _spotId?: string;
  private _vehicleId?: string;
  private _parkedAt?: Date;
  private _entryGateId?: string;

  private static instance: TicketBuilderService;

  private constructor() {}

  static getInstance (): TicketBuilderService {
    return TicketBuilderService.instance ? TicketBuilderService.instance : TicketBuilderService.instance = new TicketBuilderService();
  }

  setTicketId(ticketId: string) {
    this._ticketId = ticketId;
    return this;
  }
  setSpotId(spotId: string) {
    this._spotId = spotId;
    return this;
  }
  setVehicleId(vehicleId: string) {
    this._vehicleId = vehicleId;
    return this;
  }
  setParkedAt(parkedAt: Date) {
    this._parkedAt = parkedAt;
    return this;
  }
  setEntryGate(entryGate: string) {
    this._entryGateId = entryGate;
    return this;
  }

  build(): Ticket {
    if (!this._entryGateId || !this._parkedAt || !this._spotId || !this._ticketId || !this._vehicleId) {
      throw new Error('Missing Fields to build Ticket')
    }
    return new Ticket(this._ticketId, this._spotId, this._entryGateId, this._parkedAt, this._vehicleId);
  }
}

export { TicketBuilderService };