package entities;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Represents a floor in the parking lot.
 * The spots map is immutable after construction, so most read operations don't need synchronization.
 * Only getAvailableSpots() is synchronized as it iterates and checks mutable spot states.
 */
public class Floor {
    private final Map<String, Spot> spots = new HashMap<>();

    public Floor(List<Spot> spotList) {
        for (Spot spot : spotList) {
            spots.put(spot.getSpotId(), spot);
        }
    }

    /**
     * Gets all available (unoccupied) spots on this floor.
     * Synchronized to ensure consistent snapshot of available spots across the iteration.
     * 
     * @return List of available spots
     */
    public synchronized List<Spot> getAvailableSpots() {
        List<Spot> availableSpots = new ArrayList<>();
        for (Spot spot : spots.values()) {
            if (!spot.isOccupied()) {
                availableSpots.add(spot);
            }
        }
        return availableSpots;
    }

    /**
     * Simple read from immutable map - no synchronization needed.
     */
    public Spot getSpot(String spotId) {
        return spots.get(spotId);
    }

    /**
     * Simple read from immutable map - no synchronization needed.
     */
    public boolean hasSpot(String spotId) {
        return spots.containsKey(spotId);
    }

    /**
     * Simple read from immutable map - no synchronization needed.
     */
    public int getTotalSpots() {
        return spots.size();
    }
}
