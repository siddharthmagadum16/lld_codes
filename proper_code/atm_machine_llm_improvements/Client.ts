import { MachineState } from "./enums/enum";
import { Card } from "./models/Card";
import { AtmMachineService } from "./services/AtmMachineService";
import { ATMError } from "./utils/errors";

console.log('=== ATM Machine Simulation ===\n');

const atmMachineServiceInst = AtmMachineService.getInstance();

const card1 = new Card(1234567890, 934);
const card2 = new Card(1234567891, 932);

// Test Case 1: Successful withdrawal
console.log('--- Test Case 1: Successful Withdrawal ---');
try {
  atmMachineServiceInst.insertCard(card1);
  atmMachineServiceInst.selectOption(MachineState.ENTER_AMOUNT_TO_WITHDRAW);
  atmMachineServiceInst.submitAmountEntered(600);
  atmMachineServiceInst.submitAtmPin(9832);
} catch (error) {
  if (error instanceof ATMError) {
    console.error(`ATM Error [${error.code}]: ${error.message}`);
    if (error.recoverable) {
      console.log('Please try again.');
      atmMachineServiceInst.resetState();
    }
  } else {
    console.error('Unexpected error:', error);
  }
}

console.log('\n--- Test Case 2: Invalid Amount (not multiple of 100) ---');
try {
  atmMachineServiceInst.insertCard(card2);
  atmMachineServiceInst.selectOption(MachineState.ENTER_AMOUNT_TO_WITHDRAW);
  atmMachineServiceInst.submitAmountEntered(550); // Invalid amount
  atmMachineServiceInst.submitAtmPin(1234);
} catch (error) {
  if (error instanceof ATMError) {
    console.error(`ATM Error [${error.code}]: ${error.message}`);
    if (error.recoverable) {
      console.log('Transaction cancelled. Card returned.');
      atmMachineServiceInst.resetState();
    }
  } else {
    console.error('Unexpected error:', error);
  }
}

console.log('\n--- Test Case 3: Amount Exceeding ATM Reserve ---');
try {
  atmMachineServiceInst.insertCard(card1);
  atmMachineServiceInst.selectOption(MachineState.ENTER_AMOUNT_TO_WITHDRAW);
  atmMachineServiceInst.submitAmountEntered(10000); // More than ATM has
  atmMachineServiceInst.submitAtmPin(9832);
} catch (error) {
  if (error instanceof ATMError) {
    console.error(`ATM Error [${error.code}]: ${error.message}`);
    if (error.recoverable) {
      console.log('Transaction cancelled. Card returned.');
      atmMachineServiceInst.resetState();
    }
  } else {
    console.error('Unexpected error:', error);
  }
}

console.log('\n--- Test Case 4: Card Already Inserted Error ---');
try {
  atmMachineServiceInst.insertCard(card2);
  atmMachineServiceInst.insertCard(card1); // Try to insert another card
} catch (error) {
  if (error instanceof ATMError) {
    console.error(`ATM Error [${error.code}]: ${error.message}`);
    if (error.recoverable) {
      console.log('Please remove the current card first.');
      atmMachineServiceInst.resetState();
    }
  } else {
    console.error('Unexpected error:', error);
  }
}

console.log('\n=== ATM Machine Simulation Completed ===');