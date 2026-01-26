import { Denomination, MachineState } from "../enums/enum";
import { CashDao } from "../repository/CashDao";
import { AtmMachineState } from "./AtmMachineState";


class DispatchCashState extends AtmMachineState {

  private checkSufficientBalancePresent(): boolean {
    console.log('Checking Account Balance');
    // getCard fetch account balance, check if balance > this.machine.getAmount()
    return true;
  }

  private withdrawFromReserve(): { isWithdrawSuccessful: boolean; failureReason?: string; currencyValue: Array<[Denomination, number]>; } {
      // acquire lock
    const cashDaoInst = CashDao.getInstance();
    let amount = this.machine.getAmount();
    const currencyValue: [Denomination, number][] = [];
    const cashData = cashDaoInst.getCashData();
    const newReserve = Array.from(cashData.entries()).map(([denomination, count]): [Denomination, number] => {
      let notes = 0;
      while (denomination <= amount && count > 0) {
        amount -= denomination;
        ++ notes;
        -- count;
      }
      if (notes) {
        currencyValue.push([denomination, notes]);
      }
      return [denomination, count];
    });
    const isWithdrawSuccessful: boolean = amount == 0;
    if (isWithdrawSuccessful) {
      cashDaoInst.setCashReserve(newReserve);
    }
    // release lock
    return {
      isWithdrawSuccessful,
      failureReason: isWithdrawSuccessful ? undefined : 'Insufficent Reserve',
      currencyValue,
    }
  }
 
  public performAction(): Array<[Denomination, number]> | undefined {
    // console.log('d')
  
    const isSufficientBalancePresent = this.checkSufficientBalancePresent()
    if (!isSufficientBalancePresent) {
      console.log('Insufficient Balance in Account');
      // release lock
      this.machine.resetState();
      return ;
    }


    const { isWithdrawSuccessful, failureReason, currencyValue }= this.withdrawFromReserve()

    if (!isWithdrawSuccessful) {
      console.log('ATM FAILED: ', failureReason);
      this.machine.resetState();
      return currencyValue;
    }

    this.machine.setState(MachineState.GENERATE_RECEIPT);
    this.machine.getState().performAction();
    return currencyValue;
  }
}

export { DispatchCashState }