class Person {
  private userId: number;
  private name: string;
  constructor(_userId: number, _name: string) {
    this.userId = _userId;
    this.name = _name;
  }

  getName = () => this.name;
  getId = () => this.userId;
}

export default Person;