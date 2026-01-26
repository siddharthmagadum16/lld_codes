package services;

import constants.ParkingConstants;
import entities.Floor;
import entities.Gate;
import entities.Spot;
import entities.Vehicle;
import enums.SpotType;
import enums.VehicleType;
import interfaces.IParkingStrategy;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * Service for determining parking spot allocation strategy.
 * Thread-safe singleton implementation.
 */
public class ParkingStrategyService {
    
    private static volatile ParkingStrategyService instance;
    private final IParkingStrategy defaultStrategy;

    private ParkingStrategyService() {
        this.defaultStrategy = new NearestParkingStrategy();
    }

    public static ParkingStrategyService getInstance() {
        if (instance == null) {
            synchronized (ParkingStrategyService.class) {
                if (instance == null) {
                    instance = new ParkingStrategyService();
                }
            }
        }
        return instance;
    }

    /**
     * Gets an iterator of candidate parking spots for the given vehicle.
     * Spots are returned in priority order according to the strategy.
     * 
     * @param vehicle The vehicle to park
     * @param gate The entry gate
     * @param floors List of floors to search
     * @return Iterator of candidate spots
     */
    public Iterator<Spot> getCandidateSpots(Vehicle vehicle, Gate gate, List<Floor> floors) {
        return defaultStrategy.getCandidateSpots(vehicle, gate, floors);
    }
}

/**
 * Strategy that provides nearest available parking spots.
 * Returns an iterator that lazily evaluates spots floor by floor.
 */
class NearestParkingStrategy implements IParkingStrategy {

    @Override
    public Iterator<Spot> getCandidateSpots(Vehicle vehicle, Gate gate, List<Floor> floors) {
        VehicleType vehicleType = vehicle.getVehicleType();
        List<SpotType> allowedSpotTypes = ParkingConstants.ALLOWED_SPOTS_FOR_VEHICLE_TYPE.get(vehicleType);
        
        return new Iterator<Spot>() {
            private int floorIndex = 0;
            private List<Spot> currentFloorSpots = new ArrayList<>();
            private int spotIndex = 0;
            private Spot nextSpot = null;

            @Override
            public boolean hasNext() {
                if (nextSpot != null) {
                    return true;
                }
                
                // Find the next suitable spot
                while (true) {
                    // If we've exhausted current floor spots, move to next floor
                    if (spotIndex >= currentFloorSpots.size()) {
                        if (floorIndex >= floors.size()) {
                            return false; // No more floors to check
                        }
                        currentFloorSpots = floors.get(floorIndex).getAvailableSpots();
                        floorIndex++;
                        spotIndex = 0;
                        // If current floor has no spots, continue to next floor
                        if (currentFloorSpots.isEmpty()) {
                            continue;
                        }
                    }
                    
                    // Check if current spot is suitable for this vehicle type
                    Spot candidate = currentFloorSpots.get(spotIndex);
                    spotIndex++;
                    
                    if (allowedSpotTypes.contains(candidate.getSpotType())) {
                        nextSpot = candidate;
                        return true;
                    }
                }
            }

            @Override
            public Spot next() {
                if (!hasNext()) {
                    throw new NoSuchElementException("No more candidate spots available");
                }
                Spot spot = nextSpot;
                nextSpot = null;
                return spot;
            }
        };
    }
}
