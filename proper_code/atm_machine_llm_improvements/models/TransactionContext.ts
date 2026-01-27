import { Card } from "./Card";

class TransactionContext {
  private card?: Card;
  private amount: number = 0;
  private transactionId?: string;

  public getCard(): Card | undefined {
    return this.card;
  }

  public setCard(card?: Card): void {
    this.card = card;
  }

  public getAmount(): number {
    return this.amount;
  }

  public setAmount(amount: number): void {
    this.amount = amount;
  }

  public getTransactionId(): string | undefined {
    return this.transactionId;
  }

  public setTransactionId(id: string): void {
    this.transactionId = id;
  }

  public reset(): void {
    this.card = undefined;
    this.amount = 0;
    this.transactionId = undefined;
  }
}

export { TransactionContext }
