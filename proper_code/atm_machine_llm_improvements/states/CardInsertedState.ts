import { MachineState } from "../enums/enum";
import { AtmMachineState } from "./AtmMachineState";
import { ATMError, ErrorCode } from "../utils/errors";

class CardInsertedState extends AtmMachineState {

  private verifyCard(): void {
    const card = this.machine.getCard();
    if (!card) {
      throw new ATMError(
        'No card found',
        ErrorCode.NO_CARD_INSERTED,
        false
      );
    }
    
    // TODO: In real implementation, verify card with bank service
    console.log('Card verified successfully:', {
      cardNumber: `****${String(card.number).slice(-4)}`,
    });
  }

  public performCardInsertedSteps(): void {
    this.verifyCard();
    this.machine.displayOptions();
  }

  public selectOption(option: number): void {
    this.machine.setState(MachineState.ENTER_AMOUNT_TO_WITHDRAW);
  }
}

export { CardInsertedState }