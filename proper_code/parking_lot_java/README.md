# Parking Lot System - Java Implementation

A thread-safe parking lot management system implemented in Java with proper concurrency handling.

## Features

- **Multiple vehicle types**: Bike, Car, Truck
- **Multiple spot types**: Small, Medium, Large with proper mapping
- **Thread-safe operations**: Concurrent parking/unparking support
- **Parking strategies**: Extensible strategy pattern for spot allocation
- **No race conditions**: Atomic spot allocation without retry mechanisms

## Architecture

### Entities
- **Vehicle**: Represents a vehicle with ID and type
- **Spot**: Parking spot with thread-safe operations using `synchronized`
- **Floor**: Contains multiple spots, uses synchronized for availability checks
- **Gate**: Entry/Exit/Emergency gates
- **Ticket**: Parking ticket with entry/exit details and cost

### Services
- **ParkingLotService**: Main singleton service managing parking operations
- **ParkingStrategyService**: Strategy pattern for spot allocation
- **TicketBuilderService**: Builder pattern for ticket creation

### Concurrency Handling

#### Iterator-Based Spot Allocation (No Retry Needed!)

The system uses an **iterator-based approach** that eliminates race conditions:

```java
Iterator<Spot> candidates = strategy.getCandidateSpots(vehicle, gate, floors);
while (candidates.hasNext()) {
    Spot spot = candidates.next();
    if (spot.tryParkVehicle(vehicleId)) {
        return spot;  // Success!
    }
    // Spot taken? Automatically try next candidate
}
```

**Key Benefits:**
1. **No retry mechanism**: Natural iteration handles concurrent access
2. **Atomic operations**: Each spot is checked and claimed atomically
3. **Lazy evaluation**: Spots are evaluated on-demand, not all at once
4. **Cleaner code**: Linear flow instead of retry counters

#### Thread Safety Mechanisms

1. **Spot-level synchronization**:
   - `synchronized boolean tryParkVehicle(String vehicleId)`
   - Atomic check-and-park operation
   - No two vehicles can occupy the same spot

2. **Thread-safe collections**:
   - `ConcurrentHashMap` for ticket storage
   - `AtomicInteger` for ticket ID generation

3. **Floor-level synchronization**:
   - Only `getAvailableSpots()` is synchronized (iterates mutable state)
   - Simple reads (getSpot, hasSpot, etc.) don't need synchronization (immutable map)

4. **Singleton pattern**:
   - Double-checked locking for services
   - Thread-safe lazy initialization

## Design Patterns Used

1. **Singleton**: ParkingLotService, ParkingStrategyService
2. **Strategy**: IParkingStrategy with NearestParkingStrategy
3. **Builder**: TicketBuilderService
4. **Iterator**: Lazy spot evaluation for concurrent access

## How Concurrency Works

### Old Approach (With Retry)
```
Thread A: Find Spot1 → Try to park → Success
Thread B: Find Spot1 → Try to park → FAIL → Retry → Find Spot2 → Success
```

### New Approach (Iterator-Based)
```
Thread A: Next candidate = Spot1 → Try to park → Success
Thread B: Next candidate = Spot1 → Try to park → FAIL → Next candidate = Spot2 → Success
```

The retry is **implicit in the iteration** rather than explicit retry logic!

## Running the Application

### Compile
```bash
javac -d out $(find . -name "*.java")
```

### Run
```bash
java -cp out Client
```

### Expected Output
- Basic parking test: Demonstrates parking and unparking with cost calculation
- Concurrent test: 5 bikes compete for 2 spots, only 2 succeed (thread-safe)

## Key Implementation Details

### Why Iterator Pattern?

The iterator eliminates the gap between "finding a spot" and "parking at the spot":

**Problem with old approach:**
1. `findSpot()` returns Spot1
2. Another thread parks at Spot1
3. `tryPark(Spot1)` fails
4. Need retry logic

**Solution with iterator:**
1. Iterator provides next candidate Spot1
2. `tryPark(Spot1)` atomically checks and parks
3. If fails, iterator naturally provides next candidate
4. No retry counter needed

### Thread Safety Without Over-Synchronization

Not everything needs synchronization:
- ✅ `Floor.getAvailableSpots()`: Synchronized (iterates mutable spot states)
- ❌ `Floor.getSpot()`: No sync needed (reading immutable map structure)
- ✅ `Spot.tryParkVehicle()`: Synchronized (modifies state)
- ❌ Simple getters: No sync needed (immutable or atomic operations)

## Future Enhancements

1. Add pricing strategies (hourly, daily, vehicle-type based)
2. Add reservation system
3. Add floor-specific strategies
4. Add metrics and monitoring
5. Add payment integration
