import { MachineState } from "../enums/enum";
import { AtmMachineState } from "./AtmMachineState";
import { ATMError, ErrorCode } from "../utils/errors";

class EnterAtmPinState extends AtmMachineState {

  public performAction(): void {
    console.log('Please enter your ATM PIN:');
  }

  private verifyPin(pin: number): void {
    const card = this.machine.getCard();
    
    if (!card) {
      throw new ATMError(
        'No card found',
        ErrorCode.NO_CARD_INSERTED,
        false
      );
    }

    // TODO: In real implementation, verify PIN with bank service
    // For now, we'll do a simple check (this is just for demonstration)
    if (pin <= 0 || pin > 9999) {
      throw new ATMError(
        'Invalid PIN format',
        ErrorCode.INVALID_PIN,
        true
      );
    }

    console.log('PIN verified successfully');
  }

  public submitAtmPin(pin: number): void {
    this.verifyPin(pin);
    this.machine.setState(MachineState.DISPATCH_CASH);
    this.machine.getState().performAction();
  }
}

export { EnterAtmPinState }