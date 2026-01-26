import { MachineState } from "../enums/enum";
import { Card } from "../models/Card";
import { AtmMachineState } from "../states/AtmMachineState";
import { CardInsertedState } from "../states/CardInsertedState";
import { DispatchCashState } from "../states/DispatchCashState";
import { EnterAmountToWithdrawState } from "../states/EnterAmountToWithdrawState";
import { EnterAtmPinState } from "../states/EnterAtmPinState";
import { GenerateReceiptState } from "../states/GenerateReceiptState";
import { ReadyState } from "../states/ReadyState";


class AtmMachineService  {
  private static readonly instance: AtmMachineService = new AtmMachineService();
  protected card: Card | undefined;
  protected currentState: AtmMachineState;
  protected amount: number = 0;

  private stateMap: Map<MachineState, AtmMachineState> = new Map<MachineState, AtmMachineState> ([
    [MachineState.READY, new ReadyState(this)],
    [MachineState.CARD_INSERTED, new CardInsertedState(this)],
    [MachineState.ENTER_AMOUNT_TO_WITHDRAW, new EnterAmountToWithdrawState(this)],
    [MachineState.ENTER_ATM_PIN, new EnterAtmPinState(this)],
    [MachineState.DISPATCH_CASH, new DispatchCashState(this)],
    [MachineState.GENERATE_RECEIPT, new GenerateReceiptState(this)],
  ]);


  private constructor() {
    this.currentState = this.stateMap.get(MachineState.READY)!;
  }

  public static getInstance(): AtmMachineService {
    return AtmMachineService.instance;
  }

  public setState(state: MachineState) {
    this.currentState = this.stateMap.get(state)!;
  }
  public getState() {
    return this.currentState;
  }
  public getAmount() {
    return this.amount;
  }
  public setAmount(amount: number) {
    this.amount = amount;
  }

  public getCard () {
    return this.card;
  }

  public setCard (card?: Card) {
    this.card = card;
  }

  public resetState() {
    this.setState(MachineState.READY);
    this.currentState.performAction();
  }


  public displayOptions() {
    console.log('1. Withdraw Money');
    // console.log('2. Withdraw Money');
    // console.log('3. Reset PIN');
  }

  /** User Actions */
  public insertCard (card: Card) {
    this.currentState.insertCard(card);
  }

  public selectOption (option: MachineState) {
    this.setState(option);
    this.getState().performAction();
  }

  public submitAmountEntered (amount: number) {
    this.currentState.submitAmountEntered(amount);
  }

  public submitAtmPin (pin: number) {
    this.currentState.submitAtmPin(pin);
  }

}

export { AtmMachineService }