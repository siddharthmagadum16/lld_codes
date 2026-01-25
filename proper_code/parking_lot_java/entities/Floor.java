package entities;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Represents a floor in the parking lot.
 * Uses ConcurrentHashMap for thread-safe spot management.
 */
public class Floor {
    private final Map<String, Spot> spots = new ConcurrentHashMap<>();

    public Floor(List<Spot> spotList) {
        for (Spot spot : spotList) {
            spots.put(spot.getSpotId(), spot);
        }
    }

    /**
     * Gets all available (unoccupied) spots on this floor.
     * Thread-safe iteration over ConcurrentHashMap.
     * 
     * @return List of available spots
     */
    public List<Spot> getAvailableSpots() {
        List<Spot> availableSpots = new ArrayList<>();
        for (Spot spot : spots.values()) {
            if (!spot.isOccupied()) {
                availableSpots.add(spot);
            }
        }
        return availableSpots;
    }

    public Map<String, Spot> getSpots() {
        return spots;
    }

    public Spot getSpot(String spotId) {
        return spots.get(spotId);
    }

    public boolean hasSpot(String spotId) {
        return spots.containsKey(spotId);
    }

    public int getTotalSpots() {
        return spots.size();
    }
}
