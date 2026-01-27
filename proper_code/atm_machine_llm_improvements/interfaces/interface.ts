import { Card } from "../models/Card";
import { Denomination, MachineState } from "../enums/enum";
import { AtmMachineState } from "../states/AtmMachineState";

interface ICashDao {
  getCashData(): Map<Denomination, number>;
  setCashReserve(newReserve: [Denomination, number][]): void;
  hasSufficientCash(amount: number): boolean;
}

interface IAtmMachine {
  setState(state: MachineState): void;
  getState(): AtmMachineState;
  getAmount(): number;
  setAmount(amount: number): void;
  getCard(): Card | undefined;
  setCard(card?: Card): void;
  resetState(): void;
  displayOptions(): void;
}

interface IWithdrawalStrategy {
  withdraw(amount: number, reserve: Map<Denomination, number>): WithdrawalResult;
}

interface WithdrawalResult {
  isSuccessful: boolean;
  failureReason?: string;
  currencyValue: Array<[Denomination, number]>;
  updatedReserve: Array<[Denomination, number]>;
}

export { ICashDao, IAtmMachine, IWithdrawalStrategy, WithdrawalResult }