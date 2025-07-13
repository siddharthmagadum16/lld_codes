

class Dice {
  private static readonly instance: Dice = new Dice();

  private constructor() {}

  static getInstance = (): Dice => Dice.instance;

  rollDice = () => {
    const randomNumber = Math.round(Math.random()*10)%6 + 1;
    console.log('Dice value:', randomNumber);
    return randomNumber;
  }
};

export  {
  Dice,
};