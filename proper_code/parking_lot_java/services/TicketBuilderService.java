package services;

import entities.Ticket;

import java.util.Date;

/**
 * Builder service for creating Ticket objects.
 * Note: This is NOT a singleton in the thread-safe version to avoid
 * shared mutable state between concurrent ticket creations.
 */
public class TicketBuilderService {
    private String ticketId;
    private String spotId;
    private String vehicleId;
    private Date parkedAt;
    private String entryGateId;

    public TicketBuilderService() {
    }

    public TicketBuilderService setTicketId(String ticketId) {
        this.ticketId = ticketId;
        return this;
    }

    public TicketBuilderService setSpotId(String spotId) {
        this.spotId = spotId;
        return this;
    }

    public TicketBuilderService setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
        return this;
    }

    public TicketBuilderService setParkedAt(Date parkedAt) {
        this.parkedAt = parkedAt;
        return this;
    }

    public TicketBuilderService setEntryGateId(String entryGateId) {
        this.entryGateId = entryGateId;
        return this;
    }

    public Ticket build() {
        if (ticketId == null || spotId == null || vehicleId == null || parkedAt == null || entryGateId == null) {
            throw new IllegalStateException("Missing fields to build Ticket");
        }
        return new Ticket(ticketId, spotId, entryGateId, parkedAt, vehicleId);
    }
}
