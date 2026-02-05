

package repository;

import entities.Patient;

import java.util.HashMap;

public class PatientRepo {
    private static final PatientRepo instance = new PatientRepo();
    private HashMap<String, Patient> patients = new HashMap<>();
    private PatientRepo() { }

    public static PatientRepo getInstance() { return instance; }

    public void addPatient(Patient patient) {
        patients.put(patient.getId(), patient);
    }
}