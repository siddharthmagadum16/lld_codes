package states;

import entities.Appointment;

public abstract class AppointmentStateContext {
    protected Appointment appointment;
    AppointmentStateContext(Appointment appointment) {
        this.appointment = appointment;
    }
    public boolean scheduleAppointment(String patientId) {
        System.out.println("Invalid state. Cant schedule appointment" + appointment.getAppointmentId() + " for patient " + patientId);
        return false;
    }

    public boolean markConsulted(String notes) {
        System.out.println("Invalid state. Consultation has been already done for appointment: " + appointment.getId());
        return false;
    }

}
