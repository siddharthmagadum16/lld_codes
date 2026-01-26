package entities;

import enums.SpotType;

/**
 * Represents a parking spot with thread-safe operations.
 * Uses synchronized keyword to ensure that only one thread can park/unpark at a time.
 */
public class Spot {
    private final String spotId;
    private final SpotType spotType;
    private String vehicleId;

    public Spot(String spotId, SpotType spotType) {
        this.spotId = spotId;
        this.spotType = spotType;
    }

    /**
     * Attempts to park a vehicle at this spot.
     * Thread-safe: Uses synchronized to ensure atomic check-and-park operation.
     * 
     * @param vehicleId The ID of the vehicle to park
     * @return true if parking was successful, false if spot was already occupied
     */
    public synchronized boolean tryParkVehicle(String vehicleId) {
        if (this.vehicleId != null) {
            return false; // Spot already occupied
        }
        this.vehicleId = vehicleId;
        return true;
    }

    /**
     * Parks a vehicle at this spot (non-safe version, use tryParkVehicle for concurrent access).
     * 
     * @param vehicleId The ID of the vehicle to park
     * @throws IllegalStateException if spot is already occupied
     */
    public synchronized void parkVehicle(String vehicleId) {
        if (this.vehicleId != null) {
            throw new IllegalStateException("Spot " + spotId + " is already occupied");
        }
        this.vehicleId = vehicleId;
    }

    /**
     * Unparks the vehicle from this spot.
     * Thread-safe operation.
     */
    public synchronized void unParkVehicle() {
        this.vehicleId = null;
    }

    /**
     * Checks if the spot is currently occupied.
     * Thread-safe read operation.
     * 
     * @return true if occupied, false otherwise
     */
    public synchronized boolean isOccupied() {
        return vehicleId != null;
    }

    public String getSpotId() {
        return spotId;
    }

    public SpotType getSpotType() {
        return spotType;
    }

    public synchronized String getVehicleId() {
        return vehicleId;
    }
}
