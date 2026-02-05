package entities;

import states.AppointmentStateContext;
import states.AvailableState;

public class Appointment {

    private final String appointmentId;
    private final String doctorId;
    private final int startTime;

    private String patientId = null;
    private String notes = null;
    private AppointmentStateContext state;

    public Appointment(String _appointmentId, String _doctorId, int _startTime) {
        this.appointmentId = _appointmentId;
        this.doctorId = _doctorId;
        this.state = new AvailableState(this);
        this.startTime = _startTime;
    }

    public String getId() { return this.appointmentId; }

    public String getAppointmentId() {
        return appointmentId;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public int getStartTime() {
        return startTime;
    }

    public synchronized void setState(AppointmentStateContext state) {
        this.state = state;
    }

    public AppointmentStateContext getState() {
        return state;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    @Override
    public String toString() {
        return "Appointment{" +
                "appointmentId='" + appointmentId + '\'' +
                ", doctorId='" + doctorId + '\'' +
                ", startTime=" + startTime +
                ", patientId='" + patientId + '\'' +
                ", notes='" + notes + '\'' +
                ", state=" + state +
                '}';
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

}
