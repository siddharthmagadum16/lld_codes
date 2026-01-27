import { Denomination } from "../enums/enum";
import { ICashDao } from "../interfaces/interface";

class CashDao implements ICashDao {
  private static readonly instance: CashDao = new CashDao();
  private constructor() {}

  private cashReserve: Map<Denomination, number> = new Map<Denomination, number>([
    [Denomination.TWO_THOUSAND, 1],
    [Denomination.FIVE_HUNDRED, 2],
    [Denomination.ONE_HUNDRED, 5],
  ])

  public static getInstance(): CashDao {
    return CashDao.instance;
  }

  public getCashData(): Map<Denomination, number> {
    return structuredClone(this.cashReserve);
  }

  public setCashReserve(newReserve: [Denomination, number][]): void {
    this.cashReserve = new Map(newReserve);
  }

  public hasSufficientCash(amount: number): boolean {
    const totalCash = Array.from(this.cashReserve.entries())
      .reduce((sum, [denomination, count]) => sum + (denomination * count), 0);
    return totalCash >= amount;
  }

  public getTotalCashAvailable(): number {
    return Array.from(this.cashReserve.entries())
      .reduce((sum, [denomination, count]) => sum + (denomination * count), 0);
  }
}

export { CashDao }