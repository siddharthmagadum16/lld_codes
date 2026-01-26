import { Receipt } from "../models/Receipt";
import { AtmMachineState } from "./AtmMachineState";

class GenerateReceiptState extends AtmMachineState {

  public performAction(): void {
    console.log('Generating receipt...');
    const receipt = new Receipt(this.machine.getAmount(), new Date().toISOString());
    console.log('Receipt Generated', receipt);
    this.machine.resetState();
  }
}


export { GenerateReceiptState }