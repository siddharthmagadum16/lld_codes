import { MachineState } from "../enums/enum";
import { Card } from "../models/Card";
import { AtmMachineState } from "./AtmMachineState";


class ReadyState extends AtmMachineState {

  public insertCard(card: Card) {
    if (this.machine.getCard()) {
      console.log('Card already exists ERROR!! ', JSON.stringify(this.machine.getCard()));
      // throw new Error('Card already exists')
      return ;
    }
    this.machine.setCard(card);
    this.machine.setState(MachineState.CARD_INSERTED);
    this.machine.getState().performCardInsertedSteps();
    // change state here to card inserted  -- if current state is ready
  }

  public performAction(): void {
    this.machine.setCard(undefined);
    this.machine.setAmount(0);
  }
}

export { ReadyState }