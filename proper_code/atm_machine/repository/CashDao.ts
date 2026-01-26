import { Denomination } from "../enums/enum";


class CashDao {
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

  public getCashData () {
    return structuredClone(this.cashReserve);
  }

  public setCashReserve (newReserve: [Denomination, number][]) {
    this.cashReserve = new Map(newReserve);
  }
}


export { CashDao }