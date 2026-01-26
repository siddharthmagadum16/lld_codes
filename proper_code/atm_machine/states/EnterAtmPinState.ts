import { MachineState } from "../enums/enum";
import { Card } from "../models/Card";
import { AtmMachineService } from "../services/AtmMachineService";
import { AtmMachineState } from "./AtmMachineState";


class EnterAtmPinState extends AtmMachineState {

  public performAction(): void {
    console.log('Enter your ATM Pin.');
  }

  private verifyPin(pin: number) {
    const card = this.machine.getCard();
    // verify card details are associated with pin
    console.log('SUCCESS: Card details matched with pin');
  }

  public submitAtmPin(pin: number) {
    this.verifyPin(pin);
    this.machine.setState(MachineState.DISPATCH_CASH);
    this.machine.getState().performAction();
  }
}

export { EnterAtmPinState }