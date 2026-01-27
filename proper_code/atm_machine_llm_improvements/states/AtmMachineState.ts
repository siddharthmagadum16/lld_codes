import { Card } from "../models/Card";
import { IAtmMachine } from "../interfaces/interface";
import { ATMError, ErrorCode } from "../utils/errors";

abstract class AtmMachineState {

  constructor(protected machine: IAtmMachine) {}

  public insertCard(card: Card): void {
    throw new ATMError(
      `Cannot insert card in current state: ${this.constructor.name}`,
      ErrorCode.INVALID_STATE_OPERATION,
      true
    );
  }

  public performCardInsertedSteps(): void {
    throw new ATMError(
      `Cannot perform card inserted steps in current state: ${this.constructor.name}`,
      ErrorCode.INVALID_STATE_OPERATION,
      true
    );
  }

  public performAction(): void {
    throw new ATMError(
      `Cannot perform action in current state: ${this.constructor.name}`,
      ErrorCode.INVALID_STATE_OPERATION,
      true
    );
  }

  public submitAmountEntered(amount: number): void {
    throw new ATMError(
      `Cannot submit amount in current state: ${this.constructor.name}`,
      ErrorCode.INVALID_STATE_OPERATION,
      true
    );
  }

  public submitAtmPin(pin: number): void {
    throw new ATMError(
      `Cannot submit PIN in current state: ${this.constructor.name}`,
      ErrorCode.INVALID_STATE_OPERATION,
      true
    );
  }
}

export { AtmMachineState }