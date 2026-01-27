enum ErrorCode {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_CASH_RESERVE = 'INSUFFICIENT_CASH_RESERVE',
  INVALID_PIN = 'INVALID_PIN',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  CARD_ALREADY_INSERTED = 'CARD_ALREADY_INSERTED',
  NO_CARD_INSERTED = 'NO_CARD_INSERTED',
  INVALID_STATE_OPERATION = 'INVALID_STATE_OPERATION',
  CARD_VERIFICATION_FAILED = 'CARD_VERIFICATION_FAILED',
}

class ATMError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'ATMError';
    Object.setPrototypeOf(this, ATMError.prototype);
  }
}

export { ATMError, ErrorCode }
