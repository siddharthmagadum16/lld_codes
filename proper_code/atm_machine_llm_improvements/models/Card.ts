

class Card {
  public readonly number: number;
  public readonly cvv: number;

  constructor(number:number, cvv: number) {
    this.number = number
    this.cvv = cvv;
  }
}

export { Card }