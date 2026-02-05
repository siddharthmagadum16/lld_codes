package repository;

import entities.Appointment;
import states.AvailableState;
import states.ScheduledState;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

public class AppointmentRepo {
    private final ConcurrentHashMap<String, Appointment> appointments = new ConcurrentHashMap<>();
    private static final AppointmentRepo instance  = new AppointmentRepo();
    private AppointmentRepo() {}

    public static AppointmentRepo getInstance() { return instance; }

    public void setAppointment(Appointment appointment) {
        this.appointments.put(appointment.getId(), appointment);
    }

    public List<Appointment> getAvailableAppointmentsWithDoctorIds(List<String> doctorIds) {
        return appointments.values().stream().filter(a -> doctorIds.contains(a.getDoctorId())).toList();
    }

    public Appointment getAppointment (String appointmentId) {
        return this.appointments.get(appointmentId);
    }
    public void bookAppointment(String appointmentId, String patientId) {
        appointments.compute(appointmentId, (key, appointment) -> {
            if (appointment.getState() instanceof AvailableState currState) {
                appointment.setState(new ScheduledState(appointment));
            }
            return appointment;
        });
    }
}
