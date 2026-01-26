package services;

import entities.Floor;
import entities.Gate;
import entities.Spot;
import entities.Ticket;
import entities.Vehicle;
import enums.GateType;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Main service for parking lot operations.
 * Thread-safe singleton implementation with concurrent access handling.
 */
public class ParkingLotService {
    
    private static volatile ParkingLotService instance;
    
    private List<Floor> floors = new ArrayList<>();
    private List<Gate> gates = new ArrayList<>();
    private final Map<String, Ticket> tickets = new ConcurrentHashMap<>();
    private final AtomicInteger ticketCounter = new AtomicInteger(0);
    private final ParkingStrategyService parkingStrategyService;

    private ParkingLotService() {
        this.parkingStrategyService = ParkingStrategyService.getInstance();
    }

    public static ParkingLotService getInstance() {
        if (instance == null) {
            synchronized (ParkingLotService.class) {
                if (instance == null) {
                    instance = new ParkingLotService();
                }
            }
        }
        return instance;
    }

    /**
     * Attempts to assign a parking spot to a vehicle with proper concurrency handling.
     * Iterates through candidate spots and tries each one atomically until success.
     * No retry mechanism needed - if a spot is taken, naturally moves to the next candidate.
     * 
     * @param vehicle The vehicle to park
     * @param gate The entry gate
     * @return The assigned spot, or null if no spot available
     */
    private Spot assignParking(Vehicle vehicle, Gate gate) {
        // Get iterator of candidate spots in priority order
        java.util.Iterator<Spot> candidateSpots = parkingStrategyService.getCandidateSpots(vehicle, gate, floors);
        
        // Try each candidate spot atomically
        while (candidateSpots.hasNext()) {
            Spot candidateSpot = candidateSpots.next();
            
            // Try to atomically acquire and park at this spot
            // If successful, we're done. If not, loop continues to next candidate.
            if (candidateSpot.tryParkVehicle(vehicle.getVehicleId())) {
                return candidateSpot;
            }
            
            // Spot was occupied by another thread, automatically try next candidate
        }
        
        // No suitable spots available
        return null;
    }

    private String getNewTicketId() {
        return String.valueOf(ticketCounter.incrementAndGet());
    }

    private Ticket createTicket(String spotId, String vehicleId, String gateId) {
        return new TicketBuilderService()
                .setEntryGateId(gateId)
                .setParkedAt(new Date())
                .setSpotId(spotId)
                .setTicketId(getNewTicketId())
                .setVehicleId(vehicleId)
                .build();
    }

    /**
     * Calculates parking cost based on duration.
     * Can be extended with strategy pattern for different pricing models.
     */
    private double calculateParkingCost(Ticket ticket) {
        long parkedTime = ticket.getParkedAt().getTime();
        long unparkedTime = ticket.getUnparkedAt().getTime();
        // Cost: 10 units per millisecond (as in TypeScript version)
        return 10.0 * (unparkedTime - parkedTime);
    }

    private void populateUnParkingDetails(Ticket ticket, Spot spot, Gate gate) {
        spot.unParkVehicle();
        ticket.setExitGateId(gate.getGateId());
        ticket.setUnparkedAt(new Date());
        ticket.setCost(calculateParkingCost(ticket));
    }

    public void setFloors(List<Floor> floors) {
        this.floors = floors;
    }

    public void setGates(List<Gate> gates) {
        this.gates = gates;
    }

    public List<Floor> getFloors() {
        return floors;
    }

    public List<Gate> getGates() {
        return gates;
    }

    /**
     * Parks a vehicle in the parking lot.
     * Thread-safe: handles concurrent parking requests.
     * 
     * @param vehicle The vehicle to park
     * @param gate The entry gate (must be of type ENTRY)
     * @return The parking ticket, or null if parking failed
     * @throws IllegalArgumentException if gate type is not ENTRY
     */
    public Ticket parkVehicle(Vehicle vehicle, Gate gate) {
        if (gate.getGateType() != GateType.ENTRY) {
            throw new IllegalArgumentException("Gate type must be ENTRY");
        }

        // Check if vehicle is already parked
        if (tickets.containsKey(vehicle.getVehicleId())) {
            Ticket existingTicket = tickets.get(vehicle.getVehicleId());
            if (existingTicket.getUnparkedAt() == null) {
                System.out.println("Vehicle " + vehicle.getVehicleId() + " is already parked");
                return null;
            }
        }

        Spot chosenSpot = assignParking(vehicle, gate);
        
        if (chosenSpot == null) {
            System.out.println("This vehicle cannot be parked. Parking lot for this type of vehicle is fully occupied.");
            return null;
        }

        Ticket ticket = createTicket(chosenSpot.getSpotId(), vehicle.getVehicleId(), gate.getGateId());
        tickets.put(vehicle.getVehicleId(), ticket);
        
        System.out.println("Vehicle Parked --> vehicleId:" + vehicle.getVehicleId() + ", spotId:" + chosenSpot.getSpotId());
        return ticket;
    }

    /**
     * Unparks a vehicle from the parking lot.
     * 
     * @param vehicle The vehicle to unpark
     * @param gate The exit gate
     * @return The updated ticket with exit details
     * @throws IllegalStateException if vehicle was not parked
     */
    public Ticket unparkVehicle(Vehicle vehicle, Gate gate) {
        Ticket ticket = tickets.get(vehicle.getVehicleId());
        
        if (ticket == null || ticket.getUnparkedAt() != null) {
            throw new IllegalStateException("Vehicle was not parked before!");
        }

        Floor floor = null;
        for (Floor f : floors) {
            if (f.hasSpot(ticket.getSpotId())) {
                floor = f;
                break;
            }
        }

        if (floor == null) {
            throw new IllegalStateException("Spot not found in any floor");
        }

        Spot spot = floor.getSpot(ticket.getSpotId());
        populateUnParkingDetails(ticket, spot, gate);
        
        return ticket;
    }

    /**
     * Displays parking lot analytics including occupancy rates.
     */
    public void showAnalytics() {
        System.out.println("Floor Occupancy ----->");
        int totalOccupancy = 0;
        int totalSpots = 0;

        for (int index = 0; index < floors.size(); index++) {
            Floor floor = floors.get(index);
            int floorSpots = floor.getTotalSpots();
            int occupiedSpots = floorSpots - floor.getAvailableSpots().size();
            System.out.println("Floor:" + index + " occupied: " + occupiedSpots + " of total: " + floorSpots);
            totalOccupancy += occupiedSpots;
            totalSpots += floorSpots;
        }

        if (totalSpots > 0) {
            System.out.println("Total Occupancy rate: " + Math.round((totalOccupancy * 100.0) / totalSpots) + "%");
        }
        System.out.println("Vehicles parked till date!: " + tickets.size());
    }
}
