import { Denomination, MachineState } from "../enums/enum";
import { ICashDao, IAtmMachine, IWithdrawalStrategy } from "../interfaces/interface";
import { AtmMachineState } from "./AtmMachineState";
import { ATMError, ErrorCode } from "../utils/errors";

class DispatchCashState extends AtmMachineState {
  
  constructor(
    machine: IAtmMachine,
    private cashDao: ICashDao,
    private withdrawalStrategy: IWithdrawalStrategy
  ) {
    super(machine);
  }

  private checkSufficientBalancePresent(): boolean {
    console.log('Checking Account Balance...');
    // TODO: In real implementation, fetch account balance from bank service
    // and check if balance >= this.machine.getAmount()
    // For now, we assume sufficient balance
    return true;
  }

  private withdrawFromReserve(): { 
    isWithdrawSuccessful: boolean; 
    failureReason?: string; 
    currencyValue: Array<[Denomination, number]>; 
  } {
    const amount = this.machine.getAmount();
    
    // Check if ATM has sufficient total cash
    if (!this.cashDao.hasSufficientCash(amount)) {
      return {
        isWithdrawSuccessful: false,
        failureReason: 'ATM does not have sufficient cash',
        currencyValue: [],
      };
    }

    const cashData = this.cashDao.getCashData();
    const result = this.withdrawalStrategy.withdraw(amount, cashData);

    if (result.isSuccessful) {
      this.cashDao.setCashReserve(result.updatedReserve);
    }

    return {
      isWithdrawSuccessful: result.isSuccessful,
      failureReason: result.failureReason,
      currencyValue: result.currencyValue,
    };
  }
 
  public performAction(): Array<[Denomination, number]> | undefined {
    console.log('Dispatching cash...');
  
    const isSufficientBalancePresent = this.checkSufficientBalancePresent();
    if (!isSufficientBalancePresent) {
      throw new ATMError(
        'Insufficient balance in account',
        ErrorCode.INSUFFICIENT_BALANCE,
        true
      );
    }

    const { isWithdrawSuccessful, failureReason, currencyValue } = this.withdrawFromReserve();

    if (!isWithdrawSuccessful) {
      throw new ATMError(
        failureReason || 'Cash withdrawal failed',
        ErrorCode.INSUFFICIENT_CASH_RESERVE,
        true
      );
    }

    console.log('Cash dispensed successfully:', currencyValue);
    this.machine.setState(MachineState.GENERATE_RECEIPT);
    this.machine.getState().performAction();
    return currencyValue;
  }
}

export { DispatchCashState }