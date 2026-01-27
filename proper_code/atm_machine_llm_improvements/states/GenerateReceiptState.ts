import { Receipt } from "../models/Receipt";
import { AtmMachineState } from "./AtmMachineState";

class GenerateReceiptState extends AtmMachineState {

  public performAction(): void {
    console.log('\n=== Generating Receipt ===');
    const receipt = new Receipt(
      this.machine.getAmount(), 
      new Date().toISOString()
    );
    
    console.log('Transaction completed successfully!');
    console.log('Amount withdrawn: ₹', this.machine.getAmount());
    console.log('Timestamp:', new Date().toLocaleString());
    console.log('=========================\n');
    console.log('Please collect your cash and card.');
    
    this.machine.resetState();
  }
}

export { GenerateReceiptState }