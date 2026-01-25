package entities;

import enums.GateType;

public class Gate {
    private final String gateId;
    private final GateType gateType;

    public Gate(String gateId, GateType gateType) {
        this.gateId = gateId;
        this.gateType = gateType;
    }

    public String getGateId() {
        return gateId;
    }

    public GateType getGateType() {
        return gateType;
    }
}
