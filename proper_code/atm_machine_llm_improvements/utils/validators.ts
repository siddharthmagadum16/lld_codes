import { ATMError, ErrorCode } from "./errors";

interface ValidationResult {
  valid: boolean;
  error?: string;
}

interface IValidator<T> {
  validate(input: T): ValidationResult;
}

class AmountValidator implements IValidator<number> {
  validate(amount: number): ValidationResult {
    if (amount <= 0) {
      return { valid: false, error: 'Amount must be positive' };
    }
    if (amount % 100 !== 0) {
      return { valid: false, error: 'Amount must be a multiple of 100' };
    }
    if (amount > 50000) {
      return { valid: false, error: 'Amount exceeds maximum withdrawal limit of 50000' };
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

export { IValidator, ValidationResult, AmountValidator }
