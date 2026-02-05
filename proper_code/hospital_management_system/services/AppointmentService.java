package services;

import entities.Appointment;
import entities.Doctor;
import enums.DoctorSpeciality;
import repository.AppointmentRepo;
import repository.DoctorRepo;

import java.util.Arrays;
import java.util.List;

public class AppointmentService {

    private static final AppointmentService instance = new AppointmentService();
    private AppointmentRepo appointmentRepoInst = AppointmentRepo.getInstance();
    private DoctorRepo doctorRepoInst = DoctorRepo.getInstance();

    public static AppointmentService getInstance() { return instance; }

    public void createSlots(Doctor doctor, int[] slotTimes) {
        for (int slotTime : slotTimes) {
            Appointment appointment = new Appointment(doctor.getId() + slotTime, doctor.getId(), slotTime);
            appointmentRepoInst.setAppointment(appointment);
        }
    }

    public List<Appointment> searchAppointments(DoctorSpeciality speciality) {
        List<String> doctorIdsWithGivenSpeciality = Arrays.stream(doctorRepoInst.getDoctorsBySpeciality(speciality)).map(Doctor::getId).toList();
        return appointmentRepoInst.getAvailableAppointmentsWithDoctorIds(doctorIdsWithGivenSpeciality);
    }

    public boolean scheduleAppointment(String appointmentId, String patientId) {
        Appointment appointment = appointmentRepoInst.getAppointment(appointmentId);
        boolean isScheduled = appointment.getState().scheduleAppointment(patientId);
        if (isScheduled) {
            System.out.println("Appointment Scheduled successfully for patientId: " + patientId);
        }
        else {
//            throw new RuntimeException("Failed to schedule");
            System.out.println("Failed to schedule appointment. Appointment (" + appointmentId + ") is not available");
        }
        return isScheduled;
    }

    public boolean markConsultationCompleted(String appointmentId, String notes) {
        Appointment appointment = appointmentRepoInst.getAppointment(appointmentId);
        boolean isMarkSuccessful = appointment.getState().markConsulted(notes);
        if (isMarkSuccessful) {
            System.out.println("Successfully marked consulted");
        }
        else {
            System.out.println("Couldn't mark as consulted, current state: " + appointment.getState().getClass().getName());
        }
        return isMarkSuccessful;
    }

}
