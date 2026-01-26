import { Card } from "../models/Card";
import { AtmMachineService } from "../services/AtmMachineService";


abstract class AtmMachineState {

  constructor(protected machine: AtmMachineService) {}

  public insertCard(card: Card) { console.log('Invalid state.') }
  public performCardInsertedSteps() { console.log('Invalid state.') }
  public performAction() { console.log('Invalid state.') }
  public submitAmountEntered(amount: number) { console.log('Invalid state.') }
  public submitAtmPin(pin: number) { console.log('Invalid state.') }
  
}

export { AtmMachineState }