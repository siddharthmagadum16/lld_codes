# ATM Machine - Improvements Summary

## 🔍 Overview of Changes

This document highlights the specific improvements made to fix design principle violations and enhance code quality.

---

## 1. Fixed Dependency Inversion Principle (DIP) Violation

### ❌ Before: Direct Dependency on Concrete Class

```typescript
// DispatchCashState.ts (OLD)
class DispatchCashState extends AtmMachineState {
  private withdrawFromReserve() {
    const cashDaoInst = CashDao.getInstance(); // ❌ Service Locator Anti-pattern
    // ... use cashDaoInst directly
  }
}
```

**Problems:**
- High-level module (DispatchCashState) depends on low-level module (CashDao)
- Tight coupling
- Hard to test (can't inject mock)
- Service locator anti-pattern

### ✅ After: Dependency Injection with Interface

```typescript
// interfaces/interface.ts (NEW)
interface ICashDao {
  getCashData(): Map<Denomination, number>;
  setCashReserve(newReserve: [Denomination, number][]): void;
  hasSufficientCash(amount: number): boolean;
}

// DispatchCashState.ts (NEW)
class DispatchCashState extends AtmMachineState {
  constructor(
    machine: IAtmMachine,
    private cashDao: ICashDao,  // ✅ Injected dependency
    private withdrawalStrategy: IWithdrawalStrategy
  ) {
    super(machine);
  }

  private withdrawFromReserve() {
    const cashData = this.cashDao.getCashData(); // ✅ Uses interface
    // ...
  }
}
```

**Benefits:**
- Depends on abstraction (ICashDao), not concrete class
- Easy to inject mock for testing
- Loose coupling
- Follows Dependency Inversion Principle

---

## 2. Fixed Single Responsibility Principle (SRP) Violation

### ❌ Before: Too Many Responsibilities

```typescript
// AtmMachineService.ts (OLD)
class AtmMachineService {
  protected card: Card | undefined;      // ❌ Managing card
  protected amount: number = 0;          // ❌ Managing amount
  protected currentState: AtmMachineState; // ❌ Managing state
  
  public setState(state: MachineState) { ... }
  public getCard() { ... }
  public setCard(card?: Card) { ... }
  public getAmount() { ... }
  public setAmount(amount: number) { ... }
  public displayOptions() { ... }        // ❌ UI concerns
  public insertCard(card: Card) { ... }
  // ... many more responsibilities
}
```

**Problems:**
- Managing transaction data (card, amount)
- Managing state transitions
- Handling user actions
- UI display logic
- Too many reasons to change

### ✅ After: Separated Concerns

```typescript
// models/TransactionContext.ts (NEW)
class TransactionContext {
  private card?: Card;
  private amount: number = 0;
  private transactionId?: string;
  
  public getCard(): Card | undefined { ... }
  public setCard(card?: Card): void { ... }
  public getAmount(): number { ... }
  public setAmount(amount: number): void { ... }
  public reset(): void { ... }
}

// services/AtmMachineService.ts (NEW)
class AtmMachineService implements IAtmMachine {
  private context: TransactionContext;  // ✅ Delegated responsibility
  private currentState: AtmMachineState;
  
  public getAmount(): number {
    return this.context.getAmount();    // ✅ Delegates to context
  }
  
  public setCard(card?: Card): void {
    this.context.setCard(card);         // ✅ Delegates to context
  }
  // ... focused on state coordination only
}
```

**Benefits:**
- `TransactionContext` manages transaction data
- `AtmMachineService` focuses on state coordination
- Clear separation of concerns
- Easy to test each component independently

---

## 3. Better Error Handling

### ❌ Before: Silent Failures

```typescript
// AtmMachineState.ts (OLD)
abstract class AtmMachineState {
  public insertCard(card: Card) {
    console.log('Invalid state.'); // ❌ Silent failure
  }
  
  public submitAmountEntered(amount: number) {
    console.log('Invalid state.'); // ❌ No feedback to caller
  }
}

// DispatchCashState.ts (OLD)
if (!isWithdrawSuccessful) {
  console.log('ATM FAILED: ', failureReason); // ❌ Just logging
  this.machine.resetState();
  return currencyValue;
}
```

**Problems:**
- Errors are logged but not thrown
- Caller has no way to handle errors
- Silent failures can lead to bugs
- No error categorization

### ✅ After: Proper Exception Handling

```typescript
// utils/errors.ts (NEW)
enum ErrorCode {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_CASH_RESERVE = 'INSUFFICIENT_CASH_RESERVE',
  INVALID_PIN = 'INVALID_PIN',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  CARD_ALREADY_INSERTED = 'CARD_ALREADY_INSERTED',
  NO_CARD_INSERTED = 'NO_CARD_INSERTED',
  INVALID_STATE_OPERATION = 'INVALID_STATE_OPERATION',
}

class ATMError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public recoverable: boolean = true
  ) {
    super(message);
  }
}

// AtmMachineState.ts (NEW)
abstract class AtmMachineState {
  public insertCard(card: Card): void {
    throw new ATMError(
      `Cannot insert card in current state: ${this.constructor.name}`,
      ErrorCode.INVALID_STATE_OPERATION,
      true
    );
  }
}

// Client.ts (NEW)
try {
  atmMachineServiceInst.insertCard(card1);
  atmMachineServiceInst.submitAmountEntered(600);
} catch (error) {
  if (error instanceof ATMError) {
    console.error(`ATM Error [${error.code}]: ${error.message}`);
    if (error.recoverable) {
      atmMachineServiceInst.resetState();
    }
  }
}
```

**Benefits:**
- Errors are thrown, not silently logged
- Categorized with error codes
- Distinguishes recoverable vs non-recoverable errors
- Caller can handle errors appropriately

---

## 4. Added Validation Layer

### ❌ Before: No Validation

```typescript
// EnterAmountToWithdrawState.ts (OLD)
public submitAmountEntered(amount: number) {
  this.machine.setAmount(amount); // ❌ No validation
  this.machine.setState(MachineState.ENTER_ATM_PIN);
}
```

**Problems:**
- No validation of amount
- Negative amounts allowed
- Non-100 multiples allowed
- No maximum limit

### ✅ After: Comprehensive Validation

```typescript
// utils/validators.ts (NEW)
class AmountValidator implements IValidator<number> {
  validate(amount: number): ValidationResult {
    if (amount <= 0) {
      return { valid: false, error: 'Amount must be positive' };
    }
    if (amount % 100 !== 0) {
      return { valid: false, error: 'Amount must be a multiple of 100' };
    }
    if (amount > 50000) {
      return { valid: false, error: 'Amount exceeds maximum limit' };
    }
    return { valid: true };
  }
  
  validateOrThrow(amount: number): void {
    const result = this.validate(amount);
    if (!result.valid) {
      throw new ATMError(result.error!, ErrorCode.INVALID_AMOUNT);
    }
  }
}

// EnterAmountToWithdrawState.ts (NEW)
class EnterAmountToWithdrawState extends AtmMachineState {
  constructor(
    machine: IAtmMachine,
    private amountValidator: AmountValidator // ✅ Injected
  ) {
    super(machine);
  }

  public submitAmountEntered(amount: number): void {
    this.amountValidator.validateOrThrow(amount); // ✅ Validates
    this.machine.setAmount(amount);
    // ...
  }
}
```

**Benefits:**
- All amounts are validated before processing
- Clear validation rules
- Reusable validator
- Easy to add more validation rules

---

## 5. Strategy Pattern for Extensibility

### ❌ Before: Hardcoded Algorithm

```typescript
// DispatchCashState.ts (OLD)
private withdrawFromReserve() {
  let amount = this.machine.getAmount();
  const newReserve = Array.from(cashData.entries()).map(([denom, count]) => {
    let notes = 0;
    while (denom <= amount && count > 0) { // ❌ Hardcoded greedy algorithm
      amount -= denom;
      ++notes;
      --count;
    }
    return [denom, count];
  });
  // ...
}
```

**Problems:**
- Algorithm is hardcoded
- Can't switch to different strategy
- Difficult to test algorithm independently
- Violates Open/Closed Principle

### ✅ After: Strategy Pattern

```typescript
// interfaces/interface.ts (NEW)
interface IWithdrawalStrategy {
  withdraw(amount: number, reserve: Map<Denomination, number>): WithdrawalResult;
}

// strategies/WithdrawalStrategy.ts (NEW)
class GreedyWithdrawalStrategy implements IWithdrawalStrategy {
  withdraw(amount: number, reserve: Map<Denomination, number>): WithdrawalResult {
    // ✅ Algorithm isolated in strategy
    let remainingAmount = amount;
    const sortedDenominations = Array.from(reserve.keys()).sort((a, b) => b - a);
    // ... greedy algorithm logic
    return { isSuccessful, failureReason, currencyValue, updatedReserve };
  }
}

// DispatchCashState.ts (NEW)
class DispatchCashState extends AtmMachineState {
  constructor(
    machine: IAtmMachine,
    private cashDao: ICashDao,
    private withdrawalStrategy: IWithdrawalStrategy // ✅ Strategy injected
  ) {
    super(machine);
  }

  private withdrawFromReserve() {
    const cashData = this.cashDao.getCashData();
    const result = this.withdrawalStrategy.withdraw(amount, cashData); // ✅ Uses strategy
    // ...
  }
}
```

**Benefits:**
- Easy to add new algorithms (OptimalStrategy, MinimumNotesStrategy)
- Algorithm can be tested independently
- Follows Open/Closed Principle
- Runtime strategy switching possible

---

## 6. Improved State Pattern Implementation

### ❌ Before: Client Controls State

```typescript
// Client.ts (OLD)
atmMachineServiceInst.insertCard(card1);
atmMachineServiceInst.selectOption(MachineState.ENTER_AMOUNT_TO_WITHDRAW); // ❌ Client directly sets state
atmMachineServiceInst.submitAmountEntered(600);
```

**Problems:**
- Client can jump to any state
- Bypasses state validation
- Breaks state machine flow

### ✅ After: States Control Transitions

```typescript
// ReadyState.ts (NEW)
public insertCard(card: Card): void {
  if (this.machine.getCard()) {
    throw new ATMError('Card already inserted', ErrorCode.CARD_ALREADY_INSERTED);
  }
  this.machine.setCard(card);
  this.machine.setState(MachineState.CARD_INSERTED); // ✅ State controls transition
  this.machine.getState().performCardInsertedSteps();
}

// EnterAmountToWithdrawState.ts (NEW)
public submitAmountEntered(amount: number): void {
  this.amountValidator.validateOrThrow(amount);
  this.machine.setAmount(amount);
  this.machine.setState(MachineState.ENTER_ATM_PIN); // ✅ State controls transition
  this.machine.getState().performAction();
}
```

**Benefits:**
- States control their own transitions
- Cannot bypass state validation
- Enforces proper state machine flow
- More robust state management

---

## 📊 Summary of Improvements

| Violation/Issue | Before | After |
|----------------|--------|-------|
| **DIP Violation** | Direct dependency on `CashDao` | Depends on `ICashDao` interface |
| **Testability** | Hard to test (service locator) | Easy to test (dependency injection) |
| **Error Handling** | Silent failures with logs | Throws typed exceptions |
| **Validation** | None | Comprehensive `AmountValidator` |
| **Responsibility** | Service does too much | Separated into `TransactionContext` |
| **Extensibility** | Hardcoded algorithm | Strategy pattern for algorithms |
| **State Control** | Client controls states | States control transitions |
| **Coupling** | Tight coupling | Loose coupling via interfaces |

---

## 🎯 SOLID Principles Compliance

| Principle | Before | After |
|-----------|--------|-------|
| **Single Responsibility** | ⚠️ Partial | ✅ Full |
| **Open/Closed** | ❌ Violated | ✅ Followed |
| **Liskov Substitution** | ✅ Followed | ✅ Followed |
| **Interface Segregation** | ❌ No interfaces | ✅ Proper interfaces |
| **Dependency Inversion** | ❌ Violated | ✅ Followed |

---

## 🧪 Testing Benefits

### Before
```typescript
// Hard to test - uses singleton directly
class DispatchCashState {
  private withdrawFromReserve() {
    const cashDaoInst = CashDao.getInstance(); // ❌ Can't mock
    // ...
  }
}
```

### After
```typescript
// Easy to test with mocks
const mockCashDao: ICashDao = {
  getCashData: jest.fn().mockReturnValue(new Map([[100, 5]])),
  setCashReserve: jest.fn(),
  hasSufficientCash: jest.fn().mockReturnValue(true),
};

const mockStrategy: IWithdrawalStrategy = {
  withdraw: jest.fn().mockReturnValue({
    isSuccessful: true,
    currencyValue: [[100, 5]],
    updatedReserve: [[100, 0]],
  }),
};

const dispatchState = new DispatchCashState(
  mockMachine,
  mockCashDao,      // ✅ Inject mock
  mockStrategy      // ✅ Inject mock
);
```

---

## 🔮 Future Extensibility Examples

### Adding a New Withdrawal Strategy
```typescript
// New strategy without modifying existing code
class OptimalWithdrawalStrategy implements IWithdrawalStrategy {
  withdraw(amount: number, reserve: Map<Denomination, number>): WithdrawalResult {
    // Implement dynamic programming for optimal change
    // ...
  }
}

// Use it
const optimalStrategy = new OptimalWithdrawalStrategy();
const dispatchState = new DispatchCashState(machine, cashDao, optimalStrategy);
```

### Adding a New Validator
```typescript
class DailyLimitValidator implements IValidator<number> {
  validate(amount: number): ValidationResult {
    const dailyWithdrawn = getDailyWithdrawnAmount();
    if (dailyWithdrawn + amount > 100000) {
      return { valid: false, error: 'Daily limit exceeded' };
    }
    return { valid: true };
  }
}

// Chain validators
const validators = [amountValidator, dailyLimitValidator];
```

---

**Conclusion:** The refactored code is more maintainable, testable, extensible, and follows all SOLID principles properly.
