import { MachineState } from "../enums/enum";
import { IAtmMachine } from "../interfaces/interface";
import { AtmMachineState } from "./AtmMachineState";
import { AmountValidator } from "../utils/validators";

class EnterAmountToWithdrawState extends AtmMachineState {
  
  constructor(
    machine: IAtmMachine,
    private amountValidator: AmountValidator
  ) {
    super(machine);
  }

  public performAction(): void {
    console.log('Please enter the amount to withdraw (multiples of 100, max 50000):');
  }

  public submitAmountEntered(amount: number): void {
    // Validate amount
    this.amountValidator.validateOrThrow(amount);
    
    console.log(`Amount entered: ₹${amount}`);
    this.machine.setAmount(amount);
    this.machine.setState(MachineState.ENTER_ATM_PIN);
    this.machine.getState().performAction();
  }
}

export { EnterAmountToWithdrawState }