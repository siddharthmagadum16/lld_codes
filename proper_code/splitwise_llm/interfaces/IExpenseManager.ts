import { IUser } from "./IUser";
import { Split } from "../models/Split.js";

export interface IExpenseManager {
  addUser(user: IUser): void;
  addExpense(description: string, amount: number, paidBy: IUser, splits: Split[]): void;
  showBalance(userId: string): void;
  showBalances(): void;
}
