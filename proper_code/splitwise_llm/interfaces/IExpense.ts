import { IUser } from "./IUser";
import { ExpenseType } from "../models/ExpenseType.js";
import { Split } from "../models/Split.js";

export interface IExpense {
  getId(): string;
  getAmount(): number;
  getPaidBy(): IUser;
  getSplits(): Split[];
  getExpenseType(): ExpenseType;
  validate(): boolean;
}
