import { MachineState } from "../enums/enum";
import { Card } from "../models/Card";
import { TransactionContext } from "../models/TransactionContext";
import { AtmMachineState } from "../states/AtmMachineState";
import { CardInsertedState } from "../states/CardInsertedState";
import { DispatchCashState } from "../states/DispatchCashState";
import { EnterAmountToWithdrawState } from "../states/EnterAmountToWithdrawState";
import { EnterAtmPinState } from "../states/EnterAtmPinState";
import { GenerateReceiptState } from "../states/GenerateReceiptState";
import { ReadyState } from "../states/ReadyState";
import { IAtmMachine, ICashDao } from "../interfaces/interface";
import { CashDao } from "../repository/CashDao";
import { GreedyWithdrawalStrategy } from "../strategies/WithdrawalStrategy";
import { AmountValidator } from "../utils/validators";

class AtmMachineService implements IAtmMachine {
  private static readonly instance: AtmMachineService = new AtmMachineService();
  private context: TransactionContext;
  private currentState: AtmMachineState;
  private cashDao: ICashDao;
  private amountValidator: AmountValidator;
  private stateMap: Map<MachineState, AtmMachineState>;

  private constructor() {
    this.context = new TransactionContext();
    this.cashDao = CashDao.getInstance();
    this.amountValidator = new AmountValidator();
    
    // Initialize states with proper dependency injection
    const withdrawalStrategy = new GreedyWithdrawalStrategy();
    
    this.stateMap = new Map<MachineState, AtmMachineState>([
      [MachineState.READY, new ReadyState(this)],
      [MachineState.CARD_INSERTED, new CardInsertedState(this)],
      [MachineState.ENTER_AMOUNT_TO_WITHDRAW, new EnterAmountToWithdrawState(this, this.amountValidator)],
      [MachineState.ENTER_ATM_PIN, new EnterAtmPinState(this)],
      [MachineState.DISPATCH_CASH, new DispatchCashState(this, this.cashDao, withdrawalStrategy)],
      [MachineState.GENERATE_RECEIPT, new GenerateReceiptState(this)],
    ]);

    this.currentState = this.stateMap.get(MachineState.READY)!;
  }

  public static getInstance(): AtmMachineService {
    return AtmMachineService.instance;
  }

  public setState(state: MachineState): void {
    this.currentState = this.stateMap.get(state)!;
  }

  public getState(): AtmMachineState {
    return this.currentState;
  }

  public getAmount(): number {
    return this.context.getAmount();
  }

  public setAmount(amount: number): void {
    this.context.setAmount(amount);
  }

  public getCard(): Card | undefined {
    return this.context.getCard();
  }

  public setCard(card?: Card): void {
    this.context.setCard(card);
  }

  public resetState(): void {
    this.context.reset();
    this.setState(MachineState.READY);
    this.currentState.performAction();
  }

  public displayOptions(): void {
    console.log('\n=== ATM Options ===');
    console.log('1. Withdraw Money');
    console.log('2. Check Balance (Coming Soon)');
    console.log('3. Reset PIN (Coming Soon)');
    console.log('===================\n');
  }

  /** User Actions */
  public insertCard(card: Card): void {
    this.currentState.insertCard(card);
  }

  public selectOption(option: MachineState): void {
    this.setState(option);
    this.getState().performAction();
  }

  public submitAmountEntered(amount: number): void {
    this.currentState.submitAmountEntered(amount);
  }

  public submitAtmPin(pin: number): void {
    this.currentState.submitAtmPin(pin);
  }
}

export { AtmMachineService }