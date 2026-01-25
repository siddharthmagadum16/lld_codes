package entities;

import enums.SpotType;

import java.util.concurrent.locks.ReentrantLock;

/**
 * Represents a parking spot with thread-safe operations.
 * Uses ReentrantLock to ensure that only one thread can park/unpark at a time.
 */
public class Spot {
    private final String spotId;
    private final SpotType spotType;
    private volatile String vehicleId;
    private final ReentrantLock lock = new ReentrantLock();

    public Spot(String spotId, SpotType spotType) {
        this.spotId = spotId;
        this.spotType = spotType;
    }

    /**
     * Attempts to park a vehicle at this spot.
     * Thread-safe: Uses lock to ensure atomic check-and-park operation.
     * 
     * @param vehicleId The ID of the vehicle to park
     * @return true if parking was successful, false if spot was already occupied
     */
    public boolean tryParkVehicle(String vehicleId) {
        lock.lock();
        try {
            if (this.vehicleId != null) {
                return false; // Spot already occupied
            }
            this.vehicleId = vehicleId;
            return true;
        } finally {
            lock.unlock();
        }
    }

    /**
     * Parks a vehicle at this spot (non-safe version, use tryParkVehicle for concurrent access).
     * 
     * @param vehicleId The ID of the vehicle to park
     * @throws IllegalStateException if spot is already occupied
     */
    public void parkVehicle(String vehicleId) {
        lock.lock();
        try {
            if (this.vehicleId != null) {
                throw new IllegalStateException("Spot " + spotId + " is already occupied");
            }
            this.vehicleId = vehicleId;
        } finally {
            lock.unlock();
        }
    }

    /**
     * Unparks the vehicle from this spot.
     * Thread-safe operation.
     */
    public void unParkVehicle() {
        lock.lock();
        try {
            this.vehicleId = null;
        } finally {
            lock.unlock();
        }
    }

    /**
     * Checks if the spot is currently occupied.
     * 
     * @return true if occupied, false otherwise
     */
    public boolean isOccupied() {
        return vehicleId != null;
    }

    public String getSpotId() {
        return spotId;
    }

    public SpotType getSpotType() {
        return spotType;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    /**
     * Acquires the lock for this spot (for external synchronization).
     */
    public void acquireLock() {
        lock.lock();
    }

    /**
     * Releases the lock for this spot.
     */
    public void releaseLock() {
        lock.unlock();
    }
}
