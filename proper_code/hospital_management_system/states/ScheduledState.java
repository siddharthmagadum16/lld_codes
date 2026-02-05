package states;

import entities.Appointment;

public class ScheduledState extends AppointmentStateContext {
    public ScheduledState(Appointment appointment) {
        super(appointment);
    }

    public synchronized boolean markConsulted(String notes) {
        if (appointment.getState() instanceof ScheduledState) {
            appointment.setState(new ConsultedState(this.appointment, notes));
            return true;
        }
        return false;
    }
}