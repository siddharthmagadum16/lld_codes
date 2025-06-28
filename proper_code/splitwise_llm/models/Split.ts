import { IUser } from "../interfaces/IUser";
import { SplitType } from "./ExpenseType";

export class Split {
  constructor(
    private user: IUser,
    private amount: number,
    private type: SplitType
  ) { }

  getUser(): IUser { return this.user; }
  getAmount(): number { return this.amount; }
  getType(): SplitType { return this.type; }
}
