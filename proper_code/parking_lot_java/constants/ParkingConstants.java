package constants;

import enums.SpotType;
import enums.VehicleType;

import java.util.Arrays;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

public class ParkingConstants {
    
    public static final Map<VehicleType, List<SpotType>> ALLOWED_SPOTS_FOR_VEHICLE_TYPE;
    
    static {
        EnumMap<VehicleType, List<SpotType>> map = new EnumMap<>(VehicleType.class);
        map.put(VehicleType.BIKE, Collections.singletonList(SpotType.SMALL));
        map.put(VehicleType.CAR, Arrays.asList(SpotType.MEDIUM, SpotType.LARGE));
        map.put(VehicleType.TRUCK, Collections.singletonList(SpotType.LARGE));
        ALLOWED_SPOTS_FOR_VEHICLE_TYPE = Collections.unmodifiableMap(map);
    }
    
    private ParkingConstants() {
        // Prevent instantiation
    }
}
