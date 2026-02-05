package entities;

import enums.DoctorSpeciality;

public class Doctor {
    private final String doctorId;
    private final DoctorSpeciality speciality;

    public Doctor(String _id, DoctorSpeciality speciality) {
        doctorId = _id;
        this.speciality = speciality;
    }

    public DoctorSpeciality getSpeciality() {
        return speciality;
    }

    public String getId() {
        return doctorId;
    }
};
