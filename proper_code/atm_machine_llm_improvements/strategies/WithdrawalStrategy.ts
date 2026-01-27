import { Denomination } from "../enums/enum";
import { IWithdrawalStrategy, WithdrawalResult } from "../interfaces/interface";

class GreedyWithdrawalStrategy implements IWithdrawalStrategy {
  withdraw(amount: number, reserve: Map<Denomination, number>): WithdrawalResult {
    let remainingAmount = amount;
    const currencyValue: [Denomination, number][] = [];
    const cashData = new Map(reserve);
    
    // Sort denominations in descending order
    const sortedDenominations = Array.from(cashData.keys()).sort((a, b) => b - a);
    
    for (const denomination of sortedDenominations) {
      let count = cashData.get(denomination) || 0;
      let notes = 0;
      
      while (denomination <= remainingAmount && count > 0) {
        remainingAmount -= denomination;
        notes++;
        count--;
      }
      
      if (notes > 0) {
        currencyValue.push([denomination, notes]);
      }
      
      cashData.set(denomination, count);
    }
    
    const isSuccessful = remainingAmount === 0;
    
    return {
      isSuccessful,
      failureReason: isSuccessful ? undefined : 'Insufficient cash reserve to dispense requested amount',
      currencyValue,
      updatedReserve: Array.from(cashData.entries()),
    };
  }
}

export { GreedyWithdrawalStrategy }
