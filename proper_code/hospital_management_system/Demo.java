import entities.Appointment;
import entities.Doctor;
import entities.Patient;
import enums.DoctorSpeciality;
import repository.AppointmentRepo;
import repository.DoctorRepo;
import repository.PatientRepo;
import services.AppointmentService;

import java.util.List;

public class Demo {
    static void main() {
        AppointmentService service = AppointmentService.getInstance();

//        service.createSlots();
        Doctor doctor1 =  new Doctor("D1", DoctorSpeciality.GENERALIST);
        Doctor doctor2 =  new Doctor("D2", DoctorSpeciality.ENT);
        Doctor doctor3 =  new Doctor("D3", DoctorSpeciality.GENERALIST);

        DoctorRepo docRepo =  DoctorRepo.getInstance();
        docRepo.addDoctor(doctor1);
        docRepo.addDoctor(doctor2);
        docRepo.addDoctor(doctor3);

        AppointmentRepo appointmentRepo = AppointmentRepo.getInstance();
        service.createSlots(doctor1, new int[]{10, 11, 13});
        service.createSlots(doctor2, new int[]{11, 12, 14});
        service.createSlots(doctor3, new int[]{9, 11, 14});

        List<Appointment> availableAppointments = service.searchAppointments(DoctorSpeciality.GENERALIST);
        System.out.println("Available appointments: --------");
        for (Appointment a: availableAppointments) {
            System.out.println("Time: " + a.getStartTime() + ". doctorId: " + a.getDoctorId());
        }

        PatientRepo patientRepo = PatientRepo.getInstance();
        Patient patient1 = new Patient("P1");
        Patient patient2 = new Patient("P2");
        patientRepo.addPatient(patient1);
        patientRepo.addPatient(patient2);

        Appointment app1 = appointmentRepo.getAppointment("D111");
        System.out.println(app1.toString());

        service.scheduleAppointment("D111", patient1.getId());
        System.out.println(app1.toString());
        service.markConsultationCompleted("D111", "symptoms - fever");
        System.out.println(app1.toString());


    }
}
