package entities;

import java.util.Date;

public class Ticket {
    private final String ticketId;
    private final String spotId;
    private final String entryGateId;
    private final Date parkedAt;
    private final String vehicleId;
    
    private String exitGateId;
    private Double cost;
    private Date unparkedAt;

    public Ticket(String ticketId, String spotId, String entryGateId, Date parkedAt, String vehicleId) {
        this.ticketId = ticketId;
        this.spotId = spotId;
        this.entryGateId = entryGateId;
        this.parkedAt = parkedAt;
        this.vehicleId = vehicleId;
    }

    public String getTicketId() {
        return ticketId;
    }

    public String getSpotId() {
        return spotId;
    }

    public String getEntryGateId() {
        return entryGateId;
    }

    public Date getParkedAt() {
        return parkedAt;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public String getExitGateId() {
        return exitGateId;
    }

    public void setExitGateId(String exitGateId) {
        this.exitGateId = exitGateId;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public Date getUnparkedAt() {
        return unparkedAt;
    }

    public void setUnparkedAt(Date unparkedAt) {
        this.unparkedAt = unparkedAt;
    }
}
