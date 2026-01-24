import { Floor } from "../entities/Floor";
import { Gate } from "../entities/Gate";
import { Spot } from "../entities/Spot";
import { Ticket } from "../entities/Ticket";
import { Vehicle } from "../entities/Vehicle";
import { GateType } from "../interface";
import { ParkingStrategyService } from "./ParkingStrategyService";
import { TicketBuilderService } from "./TicketBuilderService";


class ParkingLotService {
  public floors: Floor[] = [];
  public gates: Gate[] = [];
  public tickets: Map<string, Ticket> = new Map();
  private ticketBuilderInst: TicketBuilderService;
  private parkingStrategyInst: ParkingStrategyService;
  private static instance: ParkingLotService;

  constructor () {
    this.ticketBuilderInst = TicketBuilderService.getInstance();
    this.parkingStrategyInst = ParkingStrategyService.getInstance();
  }

  static getInstance (): ParkingLotService {
    return ParkingLotService.instance ? ParkingLotService.instance : ParkingLotService.instance = new ParkingLotService();
  }
  
  private assignParking(vehicle: Vehicle, gate: Gate): Spot| undefined {
    const spot = this.parkingStrategyInst.getParkingSpot(vehicle, gate, this.floors)!;
    if (!spot) {
      return ;
    }
    else if (spot.isOccupied()) {
       throw new Error(`[internal_server_error]:${spot.spotId} Spot is already occupied`);
    }
    spot.parkVehicle(vehicle.vehicleId);
    return spot;
  }

  private getNewTicketId(): string {
    return this.tickets.size.toString();
  }

  private createTicket(spotId: string, vehicleId: string, gateId: string): Ticket {
    const ticket = this.ticketBuilderInst
    .setEntryGate(gateId)
    .setParkedAt(new Date())
    .setSpotId(spotId)
    .setTicketId(this.getNewTicketId())
    .setVehicleId(vehicleId)
    .build();

    return ticket;
  }

  private populateParkingDetails(ticket: Ticket, spot: Spot, vehicle: Vehicle) {
    spot.parkVehicle(vehicle.vehicleId);
    this.tickets.set(ticket.vehicleId, ticket);
  }

  /* Calculation on Parking cost can be improved (strategy pattern) based on the duration parked and parking spot type */
  private calculateParkingCost(ticket: Ticket): number {
    const cost = 10 * (+ticket.unparkedAt! - +ticket.parkedAt);
    return cost;
  }

  private populateUnParkingDetails(ticket: Ticket, spot: Spot, gate: Gate) {
    spot.unParkVehicle();
    ticket.exitGate = gate.gateId;
    ticket.unparkedAt = new Date();
    ticket.cost = this.calculateParkingCost(ticket);
  }

  setFloors(floors: Floor[]) { this.floors = floors; }
  setGates(gates: Gate[]) { this.gates = gates; }


  parkVehicle(vehicle: Vehicle, gate: Gate): Ticket | undefined {
    if (gate.gateType != GateType.ENTRY) {
      throw new Error('Gate type must be - Entry');
    }
    const chosenSpot = this.assignParking(vehicle, gate);
    if (!chosenSpot) {
      console.log('This vehicle Cannot be parked', 'Parking Lot for this type of vehicle is fully occupied.');
      return ;
    }
    const ticket = this.createTicket(chosenSpot.spotId, vehicle.vehicleId, gate.gateId);
    
    this.populateParkingDetails(ticket, chosenSpot, vehicle);
    console.log(`Vehicle Parked --> vehicleId:${vehicle.vehicleId}, spotId:${chosenSpot.spotId}`);
    return ticket;
  }

  unparkVehicle(vehicle: Vehicle, gate: Gate) {
    const ticket = this.tickets.get(vehicle.vehicleId);
    if (!ticket) {
      throw new Error(`Vehicle was not parked before!`);
    }
    const floor = this.floors.find(floor => floor.spots.has(ticket.spotId))!;
    const spot = floor.spots.get(ticket.spotId)!;
    this.populateUnParkingDetails(ticket, spot, gate);
    
    return ticket;
  }

  showAnalytics(): void {
    console.log('Floor Occupancy ----->');
    let totalOccupancy = 0;
    let totalSpots = 0;
    this.floors.forEach((floor, index) => {
      const floorSpots = floor.spots.size;
      const occupiedSpots = floorSpots - floor.getAvailableSpots().length;
      console.log(`Floor:${index} occupied: ${occupiedSpots} of total: ${floorSpots}`);
      totalOccupancy += occupiedSpots;
      totalSpots += floorSpots;
    });
    console.log('Total Occupancy rate: ', Math.round(totalOccupancy*100/totalSpots));
    console.log('Vehicles parked till date! : ', this.tickets.size);
  }

};

export { ParkingLotService };
