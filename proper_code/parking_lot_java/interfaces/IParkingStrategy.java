package interfaces;

import entities.Floor;
import entities.Gate;
import entities.Spot;
import entities.Vehicle;

import java.util.List;

public interface IParkingStrategy {
    Spot getParkingSpot(Vehicle vehicle, Gate gate, List<Floor> floors);
}
