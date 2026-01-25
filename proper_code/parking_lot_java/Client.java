import entities.Floor;
import entities.Gate;
import entities.Spot;
import entities.Ticket;
import entities.Vehicle;
import enums.GateType;
import enums.SpotType;
import enums.VehicleType;
import services.ParkingLotService;

import java.util.Arrays;
import java.util.Collections;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Client {

    private static void sleep(int seconds) {
        try {
            Thread.sleep(seconds * 1000L);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    public static void main(String[] args) throws InterruptedException {
        ParkingLotService parkingLotService = ParkingLotService.getInstance();

        // Create spots for Floor 0
        Spot spot01 = new Spot("SPOT01", SpotType.SMALL);
        Spot spot02 = new Spot("SPOT02", SpotType.SMALL);
        Spot spot03 = new Spot("SPOT03", SpotType.MEDIUM);
        Spot spot04 = new Spot("SPOT04", SpotType.SMALL);

        // Create spots for Floor 1
        Spot spot11 = new Spot("SPOT11", SpotType.SMALL);
        Spot spot12 = new Spot("SPOT12", SpotType.MEDIUM);
        Spot spot13 = new Spot("SPOT13", SpotType.LARGE);
        Spot spot14 = new Spot("SPOT14", SpotType.MEDIUM);

        // Create spots for Floor 2
        Spot spot21 = new Spot("SPOT21", SpotType.SMALL);
        Spot spot22 = new Spot("SPOT22", SpotType.SMALL);
        Spot spot23 = new Spot("SPOT23", SpotType.SMALL);
        Spot spot24 = new Spot("SPOT24", SpotType.SMALL);

        // Set up floors
        parkingLotService.setFloors(Arrays.asList(
                new Floor(Arrays.asList(spot01, spot02, spot03, spot04)),
                new Floor(Arrays.asList(spot11, spot12, spot13, spot14)),
                new Floor(Arrays.asList(spot21, spot22, spot23, spot24))
        ));

        // Create gates
        Gate gate01 = new Gate("GATE01", GateType.ENTRY);
        Gate gate02 = new Gate("GATE02", GateType.EXIT);
        Gate gate03 = new Gate("GATE03", GateType.ENTRY);
        Gate gate04 = new Gate("GATE04", GateType.EMERGENCY);

        parkingLotService.setGates(Arrays.asList(gate01, gate02, gate03, gate04));

        // Basic parking test (same as TypeScript version)
        System.out.println("=== Basic Parking Test ===");
        
        Vehicle vehicle1 = new Vehicle("VEHICLE01", VehicleType.BIKE);
        Vehicle vehicle2 = new Vehicle("VEHICLE02", VehicleType.CAR);
        Vehicle vehicle3 = new Vehicle("VEHICLE03", VehicleType.TRUCK);
        Vehicle vehicle4 = new Vehicle("VEHICLE04", VehicleType.TRUCK);

        Ticket ticket1 = parkingLotService.parkVehicle(vehicle1, gate01);
        Ticket ticket2 = parkingLotService.parkVehicle(vehicle2, gate03);

        sleep(2);
        
        if (ticket1 != null) {
            Ticket ticket = parkingLotService.unparkVehicle(vehicle1, gate02);
            System.out.println("--Parking Cost:: " + ticket.getCost() + " for vehicle: " + vehicle1.getVehicleId());
        }

        sleep(1);
        
        if (ticket2 != null) {
            Ticket ticket = parkingLotService.unparkVehicle(vehicle2, gate02);
            System.out.println("--Parking Cost:: " + ticket.getCost() + " for vehicle: " + vehicle2.getVehicleId());
        }

        Ticket ticket3 = parkingLotService.parkVehicle(vehicle3, gate01);
        Ticket ticket4 = parkingLotService.parkVehicle(vehicle4, gate03);

        sleep(3);
        
        if (ticket3 != null) {
            Ticket ticket = parkingLotService.unparkVehicle(vehicle3, gate02);
            System.out.println("--Parking Cost:: " + ticket.getCost() + " for vehicle: " + vehicle3.getVehicleId());
        }

        if (ticket4 != null) {
            Ticket ticket = parkingLotService.unparkVehicle(vehicle4, gate02);
            System.out.println("--Parking Cost:: " + ticket.getCost() + " for vehicle: " + vehicle4.getVehicleId());
        }

        parkingLotService.showAnalytics();

        // Concurrent parking test
        System.out.println("\n=== Concurrent Parking Test ===");
        testConcurrentParking();
    }

    /**
     * Tests concurrent parking to demonstrate thread safety.
     * Multiple threads try to park vehicles simultaneously.
     */
    private static void testConcurrentParking() throws InterruptedException {
        // Create a fresh parking lot for concurrent test
        ParkingLotService parkingLotService = ParkingLotService.getInstance();
        
        // Reset with limited spots to force competition
        Spot smallSpot1 = new Spot("CONCURRENT_SMALL_1", SpotType.SMALL);
        Spot smallSpot2 = new Spot("CONCURRENT_SMALL_2", SpotType.SMALL);
        
        parkingLotService.setFloors(Collections.singletonList(
                new Floor(Arrays.asList(smallSpot1, smallSpot2))
        ));

        Gate entryGate = new Gate("CONCURRENT_ENTRY", GateType.ENTRY);
        Gate exitGate = new Gate("CONCURRENT_EXIT", GateType.EXIT);
        parkingLotService.setGates(Arrays.asList(entryGate, exitGate));

        // Create 5 bikes competing for 2 small spots
        
        System.out.println("Attempting to park 5 bikes in 2 small spots concurrently...");
        
        try (ExecutorService executor = Executors.newFixedThreadPool(5)) {
            for (int i = 1; i <= 5; i++) {
                final int vehicleNum = i;
                executor.submit(() -> {
                    Vehicle bike = new Vehicle("CONCURRENT_BIKE_" + vehicleNum, VehicleType.BIKE);
                    Ticket ticket = parkingLotService.parkVehicle(bike, entryGate);
                    if (ticket != null) {
                        System.out.println("SUCCESS: " + bike.getVehicleId() + " parked at " + ticket.getSpotId());
                    } else {
                        System.out.println("FAILED: " + bike.getVehicleId() + " could not find parking");
                    }
                });
            }
        }

        System.out.println("\nFinal Analytics after concurrent test:");
        parkingLotService.showAnalytics();
    }
}
