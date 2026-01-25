package services;

import constants.ParkingConstants;
import entities.Floor;
import entities.Gate;
import entities.Spot;
import entities.Vehicle;
import enums.SpotType;
import enums.VehicleType;
import interfaces.IParkingStrategy;

import java.util.List;

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
     * Gets a parking spot for the given vehicle using the default strategy.
     * Note: The returned spot should be locked before parking to handle concurrency.
     * 
     * @param vehicle The vehicle to park
     * @param gate The entry gate
     * @param floors List of floors to search
     * @return A suitable spot or null if none available
     */
    public Spot getParkingSpot(Vehicle vehicle, Gate gate, List<Floor> floors) {
        return defaultStrategy.getParkingSpot(vehicle, gate, floors);
    }
}

/**
 * Strategy that finds the nearest available parking spot.
 * Searches floors in order and returns the first suitable spot.
 */
class NearestParkingStrategy implements IParkingStrategy {

    @Override
    public Spot getParkingSpot(Vehicle vehicle, Gate gate, List<Floor> floors) {
        VehicleType vehicleType = vehicle.getVehicleType();
        List<SpotType> allowedSpotTypes = ParkingConstants.ALLOWED_SPOTS_FOR_VEHICLE_TYPE.get(vehicleType);

        for (Floor floor : floors) {
            List<Spot> availableSpots = floor.getAvailableSpots();
            for (Spot spot : availableSpots) {
                if (allowedSpotTypes.contains(spot.getSpotType())) {
                    return spot;
                }
            }
        }
        return null;
    }
}
