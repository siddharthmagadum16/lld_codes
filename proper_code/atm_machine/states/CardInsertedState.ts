import { MachineState } from "../enums/enum";
import { AtmMachineState } from "./AtmMachineState";


class CardInsertedState extends AtmMachineState {
  

  private verifyCard () {
    console.log('Card verified', this.machine.getCard());
  }
  public performCardInsertedSteps() {
    this.verifyCard();
    this.machine.displayOptions();
  }

  public selectOption(option: number) {
    this.machine.setState(MachineState.ENTER_AMOUNT_TO_WITHDRAW);
  }
}

export { CardInsertedState }