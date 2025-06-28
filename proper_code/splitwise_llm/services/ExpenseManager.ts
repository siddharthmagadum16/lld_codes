import { IExpenseManager } from "../interfaces/IExpenseManager.js";
import { IUser } from "../interfaces/IUser.js";
import { Split } from "../models/Split.js";

export class ExpenseManager implements IExpenseManager {
  private balanceSheet: Map<string, Map<string, number>>;
  private users: Map<string, IUser>;
  private mutex: boolean = false;

  constructor() {
    this.balanceSheet = new Map();
    this.users = new Map();
  }

  private acquireLock(): void {
    while (this.mutex) {
      // wait
    }
    this.mutex = true;
  }

  private releaseLock(): void {
    this.mutex = false;
  }

  addUser(user: IUser): void {
    this.acquireLock();
    try {
      this.users.set(user.getId(), user);
      this.balanceSheet.set(user.getId(), new Map());
    } finally {
      this.releaseLock();
    }
  }

  addExpense(description: string, amount: number, paidBy: IUser, splits: Split[]): void {
    this.acquireLock();
    try {
      for (const split of splits) {
        const paidTo = split.getUser();
        if (paidBy.getId() !== paidTo.getId()) {
          let balances = this.balanceSheet.get(paidBy.gejtId());
          if (!balances) {
            balances = new Map();
            this.balanceSheet.set(paidBy.getId(), balances);
          }
          balances.set(paidTo.getId(), (balances.get(paidTo.getId()) || 0) + split.getAmount());

          balances = this.balanceSheet.get(paidTo.getId());
          if (!balances) {
            balances = new Map();
            this.balanceSheet.set(paidTo.getId(), balances);
          }
          balances.set(paidBy.getId(), (balances.get(paidBy.getId()) || 0) - split.getAmount());
        }
      }
    } finally {
      this.releaseLock();
    }
  }

  showBalance(userId: string): void {
    const balances = this.balanceSheet.get(userId);
    if (!balances) return;

    for (const [otherUserId, amount] of balances.entries()) {
      if (amount !== 0) {
        const otherUser = this.users.get(otherUserId);
        if (amount > 0) {
          console.log(`${otherUser?.getName()} owes ${this.users.get(userId)?.getName()}: ${amount}`);
        }
      }
    }
  }

  showBalances(): void {
    for (const userId of this.balanceSheet.keys()) {
      this.showBalance(userId);
    }
  }
}
