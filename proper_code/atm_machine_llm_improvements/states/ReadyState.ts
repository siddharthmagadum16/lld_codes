import { MachineState } from "../enums/enum";
import { Card } from "../models/Card";
import { AtmMachineState } from "./AtmMachineState";
import { ATMError, ErrorCode } from "../utils/errors";

class ReadyState extends AtmMachineState {

  public insertCard(card: Card): void {
    if (this.machine.getCard()) {
      throw new ATMError(
        'A card is already inserted. Please remove it first.',
        ErrorCode.CARD_ALREADY_INSERTED,
        true
      );
    }

    console.log('Card inserted successfully');
    this.machine.setCard(card);
    this.machine.setState(MachineState.CARD_INSERTED);
    this.machine.getState().performCardInsertedSteps();
  }

  public performAction(): void {
    console.log('ATM is ready. Please insert your card.');
    this.machine.setCard(undefined);
    this.machine.setAmount(0);
  }
}

export { ReadyState }