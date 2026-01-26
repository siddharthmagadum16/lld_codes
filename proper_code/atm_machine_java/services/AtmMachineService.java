package services;

public class AtmMachineService {
    private static final AtmMachineService instance = new AtmMachineService();

    private AtmMachineService() {
    }

    public static AtmMachineService getInstance() {
        return instance;
    }
}


