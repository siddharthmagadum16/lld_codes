package entities;


public class Consultant {
    private final String consultantId;

    public Consultant(String _id) {
        consultantId = _id;
    }

    public String getId() {
        return consultantId;
    }
};
