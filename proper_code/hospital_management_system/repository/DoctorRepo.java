package repository;

import entities.Doctor;
import enums.DoctorSpeciality;

import java.util.HashMap;

public class DoctorRepo {
    private static final DoctorRepo instance = new DoctorRepo();
    private HashMap<String, Doctor> doctors = new HashMap<>();
    private DoctorRepo() { }

    public static DoctorRepo getInstance() { return instance; }

    public Doctor[] getDoctorsBySpeciality(DoctorSpeciality speciality) {
        return doctors.values().stream().parallel().filter(d -> d.getSpeciality() == speciality).toArray(Doctor[]::new);
    }

    public void addDoctor(Doctor doctor) {
        doctors.put(doctor.getId(), doctor);
    }
}
