package entities;

public class Patient {
    private String patientId;
    public Patient(String patientId) {
        this.patientId = patientId;
    }


    public String getId() {
        return this.patientId;
    }

}
