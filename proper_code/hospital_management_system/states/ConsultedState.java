package states;

import entities.Appointment;

public class ConsultedState extends AppointmentStateContext {
    public ConsultedState(Appointment appointment, String notes) {
        super(appointment);
        appointment.setNotes(notes);
        // here consultantId should also have been set. Did not implement using consultantId
    }

}