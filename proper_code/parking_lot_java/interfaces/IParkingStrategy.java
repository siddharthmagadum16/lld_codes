package interfaces;

import entities.Floor;
import entities.Gate;
import entities.Spot;
import entities.Vehicle;

import java.util.Iterator;
import java.util.List;

/**
 * Interface for parking spot allocation strategies.
 * Returns an iterator of candidate spots in priority order for atomic parking attempts.
 */
public interface IParkingStrategy {
    /**
     * Returns an iterator of candidate parking spots in priority order.
     * The caller should try each spot atomically until one is successfully parked.
     * 
     * @param vehicle The vehicle to park
     * @param gate The entry gate
     * @param floors List of floors to search
     * @return Iterator of candidate spots in priority order
     */
    Iterator<Spot> getCandidateSpots(Vehicle vehicle, Gate gate, List<Floor> floors);
}
