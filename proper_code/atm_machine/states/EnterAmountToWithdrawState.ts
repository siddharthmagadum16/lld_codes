import { MachineState } from "../enums/enum";
import { AtmMachineState } from "./AtmMachineState";


class EnterAmountToWithdrawState extends AtmMachineState {

  public performAction() {
    console.log('Enter the Amount');
  }

  public submitAmountEntered (amount: number) {
    this.machine.setAmount(amount);
    this.machine.setState(MachineState.ENTER_ATM_PIN);
  }
}

export { EnterAmountToWithdrawState };