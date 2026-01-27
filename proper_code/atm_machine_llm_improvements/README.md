# ATM Machine - Low Level Design

A well-architected ATM machine implementation in TypeScript following SOLID principles and design patterns.

## 🎯 Design Improvements Implemented

### 1. **Dependency Inversion Principle (DIP) ✅**
- Created `IAtmMachine` and `ICashDao` interfaces
- All high-level modules now depend on abstractions, not concrete implementations
- States receive dependencies through constructor injection

### 2. **Single Responsibility Principle (SRP) ✅**
- Extracted transaction data into `TransactionContext` class
- `AtmMachineService` now focuses on state coordination
- Validation logic separated into `AmountValidator`
- Error handling separated into `ATMError` class

### 3. **Open/Closed Principle (OCP) ✅**
- Implemented Strategy pattern for withdrawal algorithms (`IWithdrawalStrategy`)
- Easy to add new withdrawal strategies without modifying existing code
- Easy to add new states without modifying the service

### 4. **Better Error Handling ✅**
- Custom `ATMError` class with error codes
- Invalid state operations now throw exceptions instead of silent failures
- Graceful error recovery with try-catch blocks
- All errors are recoverable vs non-recoverable

### 5. **Proper Dependency Injection ✅**
- `DispatchCashState` receives `ICashDao` and `IWithdrawalStrategy` via constructor
- `EnterAmountToWithdrawState` receives `AmountValidator` via constructor
- No more service locator anti-pattern

## 📁 Directory Structure

```
atm_machine/
├── Client.ts                          # Entry point with multiple test cases
├── enums/
│   └── enum.ts                        # MachineState and Denomination enums
├── interfaces/
│   └── interface.ts                   # Core interfaces (IAtmMachine, ICashDao, IWithdrawalStrategy)
├── models/
│   ├── Card.ts                        # Card entity
│   ├── Receipt.ts                     # Receipt entity
│   └── TransactionContext.ts          # Transaction state holder (NEW)
├── repository/
│   └── CashDao.ts                     # Cash reserve data access (implements ICashDao)
├── services/
│   └── AtmMachineService.ts          # Main ATM service (implements IAtmMachine)
├── states/
│   ├── AtmMachineState.ts            # Abstract base state with error throwing
│   ├── ReadyState.ts                  # Initial ready state
│   ├── CardInsertedState.ts          # Card verification state
│   ├── EnterAmountToWithdrawState.ts # Amount entry with validation
│   ├── EnterAtmPinState.ts           # PIN verification state
│   ├── DispatchCashState.ts          # Cash dispensing with DI (IMPROVED)
│   └── GenerateReceiptState.ts       # Receipt generation state
├── strategies/
│   └── WithdrawalStrategy.ts         # Greedy withdrawal algorithm (NEW)
└── utils/
    ├── errors.ts                      # ATMError class and ErrorCode enum (NEW)
    └── validators.ts                  # AmountValidator class (NEW)
```

## 🎨 Design Patterns Used

### 1. **State Pattern**
- Each ATM state is a separate class extending `AtmMachineState`
- State transitions are managed by the state machine
- Invalid operations throw errors

### 2. **Singleton Pattern**
- `AtmMachineService` and `CashDao` use singleton pattern
- Single instance throughout the application lifecycle

### 3. **Strategy Pattern**
- `IWithdrawalStrategy` allows different cash dispensing algorithms
- Currently implements `GreedyWithdrawalStrategy`
- Easy to add `OptimalWithdrawalStrategy` or `MinimumNotesStrategy`

### 4. **Dependency Injection Pattern**
- Dependencies passed through constructors
- Enables easy testing with mock objects
- Promotes loose coupling

## 🔧 Key Components

### Interfaces

#### `IAtmMachine`
```typescript
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
```

#### `ICashDao`
```typescript
interface ICashDao {
  getCashData(): Map<Denomination, number>;
  setCashReserve(newReserve: [Denomination, number][]): void;
  hasSufficientCash(amount: number): boolean;
}
```

#### `IWithdrawalStrategy`
```typescript
interface IWithdrawalStrategy {
  withdraw(amount: number, reserve: Map<Denomination, number>): WithdrawalResult;
}
```

### Error Handling

```typescript
enum ErrorCode {
  INSUFFICIENT_BALANCE,
  INSUFFICIENT_CASH_RESERVE,
  INVALID_PIN,
  INVALID_AMOUNT,
  CARD_ALREADY_INSERTED,
  NO_CARD_INSERTED,
  INVALID_STATE_OPERATION,
  CARD_VERIFICATION_FAILED,
}

class ATMError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public recoverable: boolean = true
  )
}
```

### Validation

```typescript
class AmountValidator {
  validate(amount: number): ValidationResult;
  validateOrThrow(amount: number): void;
}
```

**Rules:**
- Amount must be positive
- Amount must be a multiple of 100
- Amount must not exceed 50,000 (max withdrawal limit)

## 🚀 Running the Code

The `Client.ts` file includes multiple test cases:

1. **Successful withdrawal** - Normal flow
2. **Invalid amount** - Not a multiple of 100
3. **Insufficient ATM reserve** - Amount exceeds available cash
4. **Card already inserted** - Duplicate card insertion attempt

```bash
# Run with Node.js (after compilation)
npx tsc && node dist/proper_code/atm_machine/Client.js

# Or use tsx/ts-node
npx tsx proper_code/atm_machine/Client.ts
```

## 🔄 ATM State Flow

```
READY
  ↓ (insertCard)
CARD_INSERTED
  ↓ (selectOption)
ENTER_AMOUNT_TO_WITHDRAW
  ↓ (submitAmountEntered)
ENTER_ATM_PIN
  ↓ (submitAtmPin)
DISPATCH_CASH
  ↓ (auto transition)
GENERATE_RECEIPT
  ↓ (auto transition)
READY (reset)
```

## ✨ Benefits of This Design

### 1. **Testability**
- Easy to unit test with dependency injection
- Mock `ICashDao` for testing withdrawal logic
- Mock `IWithdrawalStrategy` for testing different algorithms

### 2. **Maintainability**
- Clear separation of concerns
- Each class has a single responsibility
- Easy to locate and fix bugs

### 3. **Extensibility**
- Add new states without modifying existing code
- Add new withdrawal strategies (e.g., optimal change-making)
- Add new payment methods (e.g., cardless withdrawal)
- Add new validators (e.g., daily withdrawal limit)

### 4. **Robustness**
- Proper error handling with meaningful error codes
- Validation at every step
- Clear error messages for users

## 🔮 Future Enhancements

### High Priority
1. **Account Service** - Verify actual account balance from bank
2. **PIN Verification Service** - Validate PIN with external service
3. **Transaction Logging** - Audit trail for all transactions
4. **Thread Safety** - Mutex locks for concurrent access to cash reserve

### Medium Priority
5. **Optimal Withdrawal Strategy** - Minimize number of notes dispensed
6. **Daily Withdrawal Limit** - Track and enforce daily limits
7. **Multiple Accounts** - Savings, checking, credit accounts
8. **Receipt Printing** - Physical receipt generation

### Low Priority
9. **Language Selection** - Multi-language support
10. **Accessibility Features** - Voice guidance, large fonts
11. **Advertisement Display** - Show ads during idle state
12. **Balance Inquiry** - Check balance without withdrawal

## 🏗️ Architecture Principles Followed

✅ **SOLID Principles**
- Single Responsibility
- Open/Closed
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

✅ **Design Patterns**
- State Pattern
- Strategy Pattern
- Singleton Pattern
- Dependency Injection

✅ **Best Practices**
- Separation of Concerns
- Fail-Fast with Exceptions
- Immutability where possible
- Type Safety with TypeScript
- Clear naming conventions

## 📊 Comparison: Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| **DIP Compliance** | ❌ Direct dependency on concrete classes | ✅ Depends on interfaces |
| **Error Handling** | ❌ Silent failures with console.log | ✅ Exceptions with error codes |
| **Testability** | ❌ Hard to test (service locator) | ✅ Easy to test (DI) |
| **Extensibility** | ⚠️ Requires code modification | ✅ Extend without modification |
| **Separation of Concerns** | ⚠️ Mixed responsibilities | ✅ Clear separation |
| **Validation** | ❌ No validation | ✅ Comprehensive validation |
| **State Management** | ⚠️ Scattered across service | ✅ Centralized in TransactionContext |

## 🎓 Key Learnings

1. **Interfaces are essential** for decoupling high-level and low-level modules
2. **Dependency Injection** enables testability and flexibility
3. **Custom Error Classes** provide better error handling than strings
4. **Validation** should be separated from business logic
5. **State Pattern** works best when states control their own transitions
6. **Strategy Pattern** makes algorithms interchangeable
7. **Context Objects** help manage state without violating SRP

---

**Author:** Improved ATM Design  
**Date:** 2026-01-26  
**Version:** 2.0 (Refactored with SOLID Principles)
