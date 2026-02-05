package states;

import entities.Appointment;

public class AvailableState extends AppointmentStateContext {
    public AvailableState(Appointment appointment) {
        super(appointment);
    }

    public synchronized boolean scheduleAppointment(String patientId) {
        if (appointment.getState() instanceof AvailableState) {
             appointment.setState(new ScheduledState(appointment));
             appointment.setPatientId(patientId);
            return true;
        }
        return false;
    }
}
